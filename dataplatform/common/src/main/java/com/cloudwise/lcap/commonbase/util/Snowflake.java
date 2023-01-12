package com.cloudwise.lcap.commonbase.util;

import java.net.InetAddress;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 基于Twitter的Snowflake算法实现分布式高效有序ID生产黑科技(sequence)——升级版Snowflake
 *
 * <br>
 * SnowFlake的结构如下(每部分用-分开):<br>
 * <br>
 * 0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 - 000000000000 <br>
 * <br>
 * 1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0<br>
 * <br>
 * 41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，而是存储时间截的差值（当前时间截 - 开始时间截)
 * 得到的值），这里的的开始时间截，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下START_TIME属性）。
 * 41位的时间截，可以使用69年，年T = (1L << 41) / (1000L * 60 * 60 * 24 * 365) = 69<br>
 * <br>
 * 10位的数据机器位，可以部署在1024个节点，包括5位dataCenterId和5位workerId<br>
 * <br>
 * 12位序列，毫秒内的计数，12位的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号<br>
 * <br>
 * <br>
 * 加起来刚好64位，为一个Long型。<br>
 * SnowFlake的优点是，整体上按照时间自增排序，并且整个分布式系统内不会产生ID碰撞(由数据中心ID和机器ID作区分)，
 * 并且效率较高，经测试，SnowFlake每秒能够产生26万ID左右。
 * <p>
 * <p>
 * 特性：
 * 1.支持自定义允许时间回拨的范围<p>
 * 2.解决跨毫秒起始值每次为0开始的情况（避免末尾必定为偶数，而不便于取余使用问题）<p>
 * 3.解决高并发场景中获取时间戳性能问题<p>
 * 4.支撑根据IP末尾数据作为workerId
 * 5.时间回拨方案思考：1024个节点中分配10个点作为时间回拨序号（连续10次时间回拨的概率较小）
 *
 * @author lry
 * @version 3.0
 * @link https://gitee.com/yu120/sequence
 */
public class Snowflake {

    /**
     * 起始时间戳
     **/
    private final static long START_TIME = 1519740777809L;
    /**
     * dataCenterId占用的位数：2
     **/
    private final static long DATA_CENTER_ID_BITS = 2L;
    /**
     * workerId占用的位数：8
     **/
    private final static long WORKER_ID_BITS = 8L;
    /**
     * 序列号占用的位数：12（表示只允许workId的范围为：0-4095）
     **/
    private final static long SEQUENCE_BITS = 12L;

    /**
     * workerId可以使用范围：0-255
     **/
    private final static long MAX_WORKER_ID = ~(-1L << WORKER_ID_BITS);
    /**
     * dataCenterId可以使用范围：0-3
     **/
    private final static long MAX_DATA_CENTER_ID = ~(-1L << DATA_CENTER_ID_BITS);

    private final static long WORKER_ID_SHIFT = SEQUENCE_BITS;
    private final static long DATA_CENTER_ID_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS;
    private final static long TIMESTAMP_LEFT_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS + DATA_CENTER_ID_BITS;

    /**
     * 用mask防止溢出:位与运算保证计算的结果范围始终是 0-4095
     **/
    private final static long SEQUENCE_MASK = ~(-1L << SEQUENCE_BITS);

    private final long workerId;
    private final long dataCenterId;
    private long sequence = 0L;
    private long lastTimestamp = -1L;

    private static byte LAST_IP = 0;
    private final boolean clock;
    private final long timeOffset;
    private final boolean randomSequence;
    private final ThreadLocalRandom tlr = ThreadLocalRandom.current();

    public Snowflake(long dataCenterId) {
        this(dataCenterId, 0x000000FF & getLastIPAddress(), false, 5L, false);
    }

    public Snowflake(long dataCenterId, boolean clock, boolean randomSequence) {
        this(dataCenterId, 0x000000FF & getLastIPAddress(), clock, 5L, randomSequence);
    }

    public static Snowflake INSTANCE = new Snowflake(3);
    /**
     * 基于Snowflake创建分布式ID生成器
     *
     * @param dataCenterId   数据中心ID,数据范围为0~255
     * @param workerId       工作机器ID,数据范围为0~3
     * @param clock          true表示解决高并发下获取时间戳的性能问题
     * @param timeOffset     允许时间回拨的毫秒量,建议5ms
     * @param randomSequence true表示使用毫秒内的随机序列(超过范围则取余)
     */
    public Snowflake(long dataCenterId, long workerId, boolean clock, long timeOffset, boolean randomSequence) {
        if (dataCenterId > MAX_DATA_CENTER_ID || dataCenterId < 0) {
            throw new IllegalArgumentException("Data Center Id can't be greater than " +
                    MAX_DATA_CENTER_ID + " or less than 0");
        }
        if (workerId > MAX_WORKER_ID || workerId < 0) {
            throw new IllegalArgumentException("Worker Id can't be greater than " +
                    MAX_WORKER_ID + " or less than 0");
        }

        this.workerId = workerId;
        this.dataCenterId = dataCenterId;
        this.clock = clock;
        this.timeOffset = timeOffset;
        this.randomSequence = randomSequence;
    }

    /**
     * 获取ID
     *
     * @return long
     */
    public synchronized Long nextId() {
        long currentTimestamp = this.timeGen();

        // 闰秒：如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过，这个时候应当抛出异常
        if (currentTimestamp < lastTimestamp) {
            // 校验时间偏移回拨量
            long offset = lastTimestamp - currentTimestamp;
            if (offset > timeOffset) {
                throw new RuntimeException("Clock moved backwards, refusing to generate id for [" + offset + "ms]");
            }

            try {
                // 时间回退timeOffset毫秒内，则允许等待2倍的偏移量后重新获取，解决小范围的时间回拨问题
                this.wait(offset << 1);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            // 再次获取
            currentTimestamp = this.timeGen();
            // 再次校验
            if (currentTimestamp < lastTimestamp) {
                throw new RuntimeException("Clock moved backwards, refusing to generate id for [" + offset + "ms]");
            }
        }

        // 同一毫秒内序列直接自增
        if (lastTimestamp == currentTimestamp) {
            // randomSequence为true表示随机生成允许范围内的序列起始值并取余数,否则毫秒内起始值为0L开始自增
            long tempSequence = sequence + 1;
            if (randomSequence && tempSequence > SEQUENCE_MASK) {
                tempSequence = tempSequence % SEQUENCE_MASK;
            }

            // 通过位与运算保证计算的结果范围始终是 0-4095
            sequence = tempSequence & SEQUENCE_MASK;
            if (sequence == 0) {
                currentTimestamp = this.tilNextMillis(lastTimestamp);
            }
        } else {
            // randomSequence为true表示随机生成允许范围内的序列起始值,否则毫秒内起始值为0L开始自增
            sequence = randomSequence ? tlr.nextLong(SEQUENCE_MASK + 1) : 0L;
        }

        lastTimestamp = currentTimestamp;
        long currentOffsetTime = currentTimestamp - START_TIME;

        /*
         * 1.左移运算是为了将数值移动到对应的段(41、5、5，12那段因为本来就在最右，因此不用左移)
         * 2.然后对每个左移后的值(la、lb、lc、sequence)做位或运算，是为了把各个短的数据合并起来，合并成一个二进制数
         * 3.最后转换成10进制，就是最终生成的id
         */
        return (currentOffsetTime << TIMESTAMP_LEFT_SHIFT) |
                // 数据中心位
                (dataCenterId << DATA_CENTER_ID_SHIFT) |
                // 工作ID位
                (workerId << WORKER_ID_SHIFT) |
                // 毫秒序列化位
                sequence;
    }

    /**
     * 保证返回的毫秒数在参数之后(阻塞到下一个毫秒，直到获得新的时间戳)——CAS
     *
     * @param lastTimestamp last timestamp
     * @return next millis
     */
    private long tilNextMillis(long lastTimestamp) {
        long timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
            // 如果发现时间回拨，则自动重新获取（可能会处于无限循环中）
            timestamp = this.timeGen();
        }

        return timestamp;
    }

    /**
     * 获得系统当前毫秒时间戳
     *
     * @return timestamp 毫秒时间戳
     */
    private long timeGen() {
        return clock ? currentTimeMillis() : System.currentTimeMillis();
    }

    /**
     * 用IP地址最后几个字节标示
     * <p>
     * eg:192.168.1.30->30
     *
     * @return last IP
     */
    private static byte getLastIPAddress() {
        if (LAST_IP != 0) {
            return LAST_IP;
        }

        try {
            InetAddress inetAddress = InetAddress.getLocalHost();
            byte[] addressByte = inetAddress.getAddress();
            LAST_IP = addressByte[addressByte.length - 1];
        } catch (Exception e) {
            throw new RuntimeException("Unknown Host Exception", e);
        }

        return LAST_IP;
    }


    /**
     * The get current time milliseconds
     * 利用ScheduledExecutorService实现高并发场景下System.currentTimeMillis()的性能问题的优化.
     * @return long time
     */
    private static AtomicLong nowTime;
    private static volatile boolean started = false;
    public static long currentTimeMillis() {
        if (!started) {
            synchronized (Snowflake.class) {
                if (!started) {
                    nowTime = new AtomicLong(System.currentTimeMillis());
                    ScheduledExecutorService executorService = new ScheduledThreadPoolExecutor(
                            1, r -> {
                        Thread thread = new Thread(r, "system-clock");
                        thread.setDaemon(true);
                        return thread;
                    });
                    executorService.scheduleAtFixedRate(() ->
                            nowTime.set(System.currentTimeMillis()), 1, 1, TimeUnit.MILLISECONDS);
                    Runtime.getRuntime().addShutdownHook(new Thread(executorService::shutdown));
                    started = true;
                }
            }
        }

        return nowTime.get();
    }
}