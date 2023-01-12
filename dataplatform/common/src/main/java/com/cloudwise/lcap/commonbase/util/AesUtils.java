package com.cloudwise.lcap.commonbase.util;

import org.apache.tomcat.util.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class AesUtils {

    //偏移量字符串必须是16位 当模式是CBC的时候必须设置偏移量
    private static String iv = "cxZhhYhet2X4OOMq";
    private static String Algorithm = "AES";
    //算法/模式/补码方式
    private static String AlgorithmProvider = "AES/CBC/PKCS5Padding";
    private static IvParameterSpec ivParameterSpec = new IvParameterSpec(iv.getBytes(StandardCharsets.UTF_8));

    // 密钥必须是16的倍数
    private static String privateKey = "BYkCpvTfyZ%hrJYSrOUWxPhrJAOZcVZo";

    public static String encrypt(String src) throws Exception {
        byte[] key = privateKey.getBytes(StandardCharsets.UTF_8);
        SecretKey secretKey = new SecretKeySpec(key, Algorithm);
        Cipher cipher = Cipher.getInstance(AlgorithmProvider);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivParameterSpec);
        byte[] encrypt = cipher.doFinal(src.getBytes(StandardCharsets.UTF_8));
        return byteToHexString(encrypt);
    }

    public static String decrypt(String src) throws Exception {
        byte key[] = privateKey.getBytes(StandardCharsets.UTF_8);
        SecretKey secretKey = new SecretKeySpec(key, Algorithm);
        Cipher cipher = Cipher.getInstance(AlgorithmProvider);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, ivParameterSpec);
        byte[] hexBytes = hexStringToBytes(src);
        byte[] decrypt = cipher.doFinal(hexBytes);
        return new String(decrypt, StandardCharsets.UTF_8);
    }

    /**
     * 将byte转换为16进制字符串
     *
     * @param src
     * @return
     */
    private static String byteToHexString(byte[] src) {
        StringBuilder sb = new StringBuilder();
        for (byte b : src) {
            int v = b & 0xff;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                sb.append("0");
            }
            sb.append(hv);
        }
        return sb.toString();
    }

    /**
     * 将16进制字符串装换为byte数组
     *
     * @param hexString
     * @return
     */
    private static byte[] hexStringToBytes(String hexString) {
        hexString = hexString.toUpperCase();
        int length = hexString.length() / 2;
        char[] hexChars = hexString.toCharArray();
        byte[] b = new byte[length];
        for (int i = 0; i < length; i++) {
            int pos = i * 2;
            b[i] = (byte) (charToByte(hexChars[pos]) << 4 | (charToByte(hexChars[pos + 1]) & 0xff));
        }
        return b;
    }

    private static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }

    public static void main(String[] args) {
        try {

            String src = encrypt("applicationShareUrl");

            String encrypted64 = byteToHexString(Base64.decodeBase64(src));
            String decrypt = decrypt(src);
            System.out.println("解密后的结果：" + decrypt);

//            String decryptValue = RSAUtils.decrypt("kaY1YA0kN/ov+mmFUZSnKoPHQu6t/u1xRtbfqh/jzmiz+rjEq5puFeDQlkJbZXaWIzitYz5Y/6vYdaALItojYURtyFDiIwbU05itXam0IUXlcDCf7hXvEz80lalyDX23XKKoEvDAg9AqOCyh2f3g4LSP26HrIZAI6QJlfcINGwY=");
//            System.out.println("解密后的结果：" + decryptValue);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
