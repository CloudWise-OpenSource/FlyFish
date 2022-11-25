package com.cloudwise.lcap.common.utils;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.io.IORuntimeException;
import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.exception.BizException;
import com.cloudwise.lcap.common.exception.RejectedException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
public class FileUtils {


    public static String readJsonFile(InputStream inputStream) {
        String jsonStr = "";
        try {
            Reader reader = new InputStreamReader(inputStream);
            int ch = 0;
            StringBuffer sb = new StringBuffer();
            while ((ch = reader.read()) != -1) {
                sb.append((char) ch);
            }
            reader.close();
            jsonStr = sb.toString();
            return jsonStr;
        } catch (IOException e) {
            e.printStackTrace();
            throw new BizException("文件解析失败");
        }
    }

    public static String readJsonFile(String filepath) {
        String jsonStr = "";
        try {
            File jsonFile = new File(filepath);
            FileReader fileReader = new FileReader(jsonFile);
            Reader reader = new InputStreamReader(new FileInputStream(jsonFile), StandardCharsets.UTF_8);
            int ch = 0;
            StringBuffer sb = new StringBuffer();
            while ((ch = reader.read()) != -1) {
                sb.append((char) ch);
            }
            fileReader.close();
            reader.close();
            jsonStr = sb.toString();
            return jsonStr;
        } catch (IOException e) {
            e.printStackTrace();
            throw new BizException("文件解析失败");
        }
    }


    public static List<JSONObject> readCSVFile(String filePath) {
        List<JSONObject> fileInfo = new ArrayList<>();

        try {
            BufferedReader reader = new BufferedReader(new FileReader(filePath));
            //第一行信息
            String keyrow = reader.readLine();
            String[] keys = keyrow.split(",");
            String line = null;
            JSONObject json = new JSONObject();
            while ((line = reader.readLine()) != null) {
                //CSV格式文件为逗号分隔符文件
                String item[] = line.split(",");
                for (int i = 0; i < item.length && i < keys.length; i++) {
                    json.put(keys[i], item[i]);
                }
                fileInfo.add(json);
            }
            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new BizException("文件解析失败");
        }

        return fileInfo;
    }

    public static List<JSONObject> readCSVFile(File file) {

        List<JSONObject> fileInfo = null;
        try {
            fileInfo = new ArrayList<>();
            BufferedReader reader = new BufferedReader(new FileReader(file));
            //第一行信息
            String keyrow = reader.readLine();
            String[] keys = keyrow.split(",");
            for (String fieldName : keys) {
                //字段名只能包含 字母、数字、下划线，并且不能是纯数字
                if (!ValidatorUtils.varValidate(fieldName)) {
                    log.error("csv文件表字段定义校验失败,表字段仅支持包含字母、数字、下划线");
                    throw new BizException("csv文件表字段定义校验失败,表字段仅支持字母、数字、下划线,并且不能是纯数字");
                }
            }
            String line = null;
            JSONObject json = new JSONObject();
            while ((line = reader.readLine()) != null) {
                //CSV格式文件为逗号分隔符文件
                String item[] = line.split(",");
                for (int i = 0; i < item.length && i < keys.length; i++) {
                    json.put(keys[i], item[i]);
                }
                fileInfo.add(json);
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
            log.error("文件解析失败,exception:{}", e);
            throw new BizException("文件格式解析失败,请确认文件内容是否符合csv结构");
        }


        return fileInfo;
    }


    public static void deleteFile(File file) {
        if (file == null || !file.exists()) {
            return;
        }
        //获取目录下子文件
        File[] files = file.listFiles();
        //遍历该目录下的文件对象
        for (File f : files) {
            //判断子目录是否存在子目录,如果是文件则删除
            if (f.isDirectory()) {
                //递归删除目录下的文件
                deleteFile(f);
            } else {
                //文件删除
                f.deleteOnExit();
            }
        }
        //文件夹删除
        file.deleteOnExit();
    }

    /**
     * 往json文件中写入数据
     *
     * @param filePath json文件路径
     * @param inMap    Map类型数据
     * @return 写入文件状态  成功或失败
     */
    public static String writeJson(String filePath, String fileName, Map<String, Object> inMap) {
        // Map数据转化为Json，再转换为String
        String data = new JSONObject(inMap).toString();
        File fileDir = new File(filePath);
        if (!fileDir.exists()) {
            fileDir.mkdirs();
        }
        try {
            String absPath = filePath + File.separator + fileName;
            File file = new File(absPath);
            // 文件不存在就创建文件
            if (!file.exists()) {
                file.createNewFile();
            }
            //false表示覆盖文件数据
            FileWriter fileWriter = new FileWriter(absPath, false);
            BufferedWriter bw = new BufferedWriter(fileWriter);
            bw.write(data);
            bw.close();
            return "success";
        } catch (IOException e) {
            return "error";
        }
    }


    /**
     * 读取json文件内容
     */
    /**
     * 读取json文件数据
     *
     * @param jsonPath json文件路径
     * @return 字符串
     */
    public static String readJson(String jsonPath) {
        File jsonFile = new File(jsonPath);
        try {
            FileReader fileReader = new FileReader(jsonFile);
            BufferedReader reader = new BufferedReader(fileReader);
            StringBuilder sb = new StringBuilder();
            while (true) {
                int ch = reader.read();
                if (ch != -1) {
                    sb.append((char) ch);
                } else {
                    break;
                }
            }
            fileReader.close();
            reader.close();
            return sb.toString();
        } catch (IOException e) {
            return "";
        }
    }

    /**
     * 复制文件到目标文件夹。
     * 如果源是文件，则将文件复制到目标文件夹下
     * 如果源是文件夹，则将源文件夹的最后一级拼接到目标文件夹，然后继续迭代源文件夹，直到源是文件
     * @param sourceFolder 源文件或文件夹
     * @param excludePath 在源文件夹中需要被排除的文件
     * @param destFolder 目标文件夹，将被复制到的文件夹
     */
    public static void copyFolder(String sourceFolder, List<String> excludePath, String destFolder) {
        String fileName = sourceFolder.substring(sourceFolder.lastIndexOf("/") + 1);
        if (fileName.startsWith(".")) {
            log.info(".文件忽略" + sourceFolder);
            return;
        } else if (CollectionUtil.isNotEmpty(excludePath)) {
            for (String path : excludePath) {
                String subPath = path.substring(path.lastIndexOf("/") + 1);
                if (subPath.equalsIgnoreCase(sourceFolder) ||path.equalsIgnoreCase(sourceFolder) || fileName.equalsIgnoreCase(path)) {
                    log.info("copy文件排除path:{}",path);
                    return;
                }
            }
        }
        File file = new File(sourceFolder);
        if (!file.exists()) {
            log.error("源文件夹:{}不存在", sourceFolder);
            return;
        }
        File destFile = new File(destFolder);
        if (!destFile.exists()) {
            destFile.mkdirs();
        }

        if (file.isFile()) {
            FileInputStream inputStream = null;
            FileOutputStream outputStream = null;
            try {
                inputStream = new FileInputStream(file);
                File file1 = new File(destFolder, file.getName());
                outputStream = new FileOutputStream(file1);
                IoUtil.copy(inputStream, outputStream);
            } catch (FileNotFoundException | IORuntimeException e) {
                e.printStackTrace();
                log.error("xxx e" + e);
                log.error("文件夹:{}复制到:{}失败,exception:{}", file.getAbsolutePath(), destFile.getAbsolutePath() + File.separator + file.getName(), e);
                throw new BizException("文件夹复制失败");
            } finally {
                try {
                    if (null != inputStream) {
                        inputStream.close();
                    }
                    if (null != outputStream) {
                        outputStream.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } else if (file.isDirectory()) {
            File file2 = new File(destFolder + File.separator + file.getName());
            file2.mkdirs();
            //是文件夹，先创建同名文件夹
            for (File file1 : Objects.requireNonNull(file.listFiles())) {
                copyFolder(file1.getAbsolutePath(), excludePath, file2.getAbsolutePath());
            }
        }
    }


    public static void copyFile(String sourceFile, String destFile) {
        try {
            //复制文件
            FileInputStream inputStream = new FileInputStream(sourceFile);
            FileOutputStream outputStream = new FileOutputStream(destFile);
            IoUtil.copy(inputStream, outputStream);
        } catch (FileNotFoundException e) {
            log.error("文件夹复制失败" + e);
            throw new BizException("文件夹复制失败");
        }

    }

    public static void delFolder(String destFolder) {
        File file = new File(destFolder);
        if (file.exists()) {
            //如果是文件,则复制文件
            if (file.isFile()) {
                file.deleteOnExit();
            } else if (file.isDirectory()) {
                File[] files = file.listFiles();
                for (File file1 : files) {
                    delFolder(file1.getAbsolutePath());
                }
                file.deleteOnExit();
            }
        }
        file.deleteOnExit();
    }


    /**
     * 在源文件上修改文件内容
     *
     * @param filePath   文件路径
     * @param sourceWord 源字符串
     * @param targetWord 待修改的字符串
     * @return
     */
    public static boolean autoReplace(String filePath, String sourceWord, String targetWord) {
        try {
            File file = new File(filePath);
            if (!file.exists() || !file.isFile()) {
                log.error("文件:{}不存在",filePath);
                return false;
            }
            Long fileLength = file.length();
            byte[] fileContext = new byte[fileLength.intValue()];
            FileInputStream in = new FileInputStream(filePath);
            in.read(fileContext);
            in.close();
            String str = new String(fileContext);

            str = str.replace(sourceWord, targetWord);

            PrintWriter out = new PrintWriter(filePath);
            out.write(str.toCharArray());
            out.flush();
            out.close();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RejectedException("文件内容替换失败");
        }
    }

    public static String getFileName(String agent, String fileName) {

        if (StringUtils.isBlank(agent)) {
            return fileName;
        }

        try {
            if (agent.contains("MSIE")) {
                fileName = URLEncoder.encode(fileName, "utf-8");
                fileName = fileName.replace("+", " ");
            }
//            else if (agent.contains("Firefox")){
//                fileName = new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
//            }
            else {
                fileName = URLEncoder.encode(fileName, "utf-8");
            }
        } catch (Exception e) {
            log.error("file encode error. filename is {}, exceptions is {}", fileName, e.getMessage());
        }
        return fileName;
    }

}
