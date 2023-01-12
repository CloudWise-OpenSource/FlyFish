package com.cloudwise.lcap.commonbase.util;

import cn.hutool.core.io.IORuntimeException;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.text.csv.CsvData;
import cn.hutool.core.text.csv.CsvReadConfig;
import cn.hutool.core.text.csv.CsvReader;
import cn.hutool.core.text.csv.CsvRow;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.exception.FileUnValidateException;
import com.cloudwise.lcap.commonbase.exception.RejectedException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
public class FileUtils {

    public static List<JSONObject> readJsonFile2(String filepath) {
        String fileData = readJsonFile(filepath);
        try {
            JsonNode jsonNode = JsonUtils.objectMapper.readTree(fileData);
            List<JSONObject> jsonObjects = new ArrayList<>();
            if (jsonNode.getNodeType() == JsonNodeType.ARRAY) {
                jsonObjects.addAll(Objects.requireNonNull(JsonUtils.parseArray(fileData, JSONObject.class)));
                return jsonObjects;
            } else if (jsonNode.getNodeType() == JsonNodeType.OBJECT || jsonNode.getNodeType() == JsonNodeType.POJO) {
                jsonObjects.add(JsonUtils.parse(fileData, JSONObject.class));
            }

            //将复杂的value改为字符串结构
            for (JSONObject jsonObject : jsonObjects) {
                for (String key : jsonObject.keySet()) {
                    jsonObject.put(key, jsonObject.get(key).toString());
                }
            }
            return jsonObjects;
        } catch (JsonProcessingException e) {
            log.error("文件解析失败");
            throw new FileUnValidateException("文件解析失败");
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


    public static List<JSONObject> readCSVFile(File file) {
        List<JSONObject> strList = new ArrayList<>();
        ;
        try {
            CsvReadConfig csvReadConfig = CsvReadConfig.defaultConfig().setSkipEmptyRows(true).setTrimField(true).setContainsHeader(true);
            CsvReader reader = new CsvReader(file, StandardCharsets.UTF_8, csvReadConfig);

            CsvData read = reader.read();
            List<CsvRow> rows = read.getRows();
            for (CsvRow row : rows) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.putAll(row.getFieldMap());
                strList.add(jsonObject);
            }
            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return strList;
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
        BufferedWriter bw = null;
        FileWriter fileWriter = null;
        try {
            String absPath = filePath + File.separator + fileName;
            File file = new File(absPath);
            // 文件不存在就创建文件
            if (!file.exists()) {
                boolean newFile = file.createNewFile();
                if (!newFile) {
                    throw new BizException("创建文件失败");
                }
            }
            //false表示覆盖文件数据
            fileWriter = new FileWriter(absPath, false);
            bw = new BufferedWriter(fileWriter);
            bw.write(data);
            return "success";
        } catch (IOException e) {
            return "error";
        } finally {
            try {
                if (bw != null) {
                    bw.close();
                }
                if (fileWriter != null) {
                    fileWriter.close();
                }
            } catch (IOException e) {
            }
        }
    }

    public static String writeStr(String filePath, String fileName, String str) {
        File fileDir = new File(filePath);
        if (!fileDir.exists()) {
            fileDir.mkdirs();
        }
        BufferedWriter bw = null;
        FileWriter fileWriter = null;
        try {
            String absPath = filePath + File.separator + fileName;
            File file = new File(absPath);
            if (!file.exists()) {
                boolean newFile = file.createNewFile();
                if (!newFile) {
                    throw new BizException("创建文件失败");
                }
            }

            fileWriter = new FileWriter(absPath, false);
            bw = new BufferedWriter(fileWriter);
            bw.write(str);
            return "success";
        } catch (IOException e) {
            return "error";
        } finally {
            try {
                if (bw != null) {
                    bw.close();
                }
                if (fileWriter != null) {
                    fileWriter.close();
                }
            } catch (IOException e) {
            }
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
        BufferedReader reader = null;
        FileReader fileReader = null;
        try {
            fileReader = new FileReader(jsonFile);
            reader = new BufferedReader(fileReader);
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
            return sb.toString();
        } catch (IOException e) {
            return "";
        } finally {
            try {
                if (reader != null) {
                    reader.close();
                }
                if (fileReader != null) {
                    fileReader.close();
                }
            } catch (IOException e) {
            }
        }
    }

    public static void main(String[] args) {
        String coverFile = "/Users/yinqiqi/Downloads/component20221230114000/components/604382273386565632/V1.2.0/release/cover.jpeg";
        String imageName = coverFile.substring(coverFile.lastIndexOf("/"));
        log.info("");
    }

    /**
     * 复制文件到目标文件夹。
     * 如果源是文件，则将文件复制到目标文件夹下
     * 如果源是文件夹，则将源文件夹的最后一级拼接到目标文件夹，然后继续迭代源文件夹，直到源是文件
     *
     * @param sourceFolder 源文件或文件夹
     * @param excludePath  在源文件夹中需要被排除的文件
     * @param destFolder   目标文件夹，将被复制到的文件夹
     */
    public static void copyFolder(String sourceFolder, List<String> excludePath, String destFolder) {
        File file = new File(sourceFolder);
        if (!file.exists()) {
            log.error("源文件夹:{}不存在", sourceFolder);
            return;
        }
        excludePath = Arrays.asList("node_modules", ".git");
        String fileName = sourceFolder.substring(sourceFolder.lastIndexOf("/") + 1);
        if (fileName.startsWith(".") || excludePath.contains(fileName.toLowerCase())) {
            log.info(".文件忽略" + sourceFolder);
            return;
        }

        if (!new File(destFolder).exists()) {
            new File(destFolder).mkdirs();
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
                log.error("文件夹:{}复制到:{}失败,exception:{}", file.getAbsolutePath(), destFolder + File.separator + file.getName(), e);
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
            //是文件夹，先创建同名文件夹
            for (File file1 : file.listFiles()) {
                copyFolder(file1.getAbsolutePath(), excludePath, destFolder + File.separator + file.getName());
            }
        }
    }


    public static void copyFolderWithDepth(String sourceFolder, List<String> excludePath, String destFolder, Integer depth) {
        if (null == excludePath){
            excludePath = new ArrayList<>();
        }
        if (depth == null) depth = 0;
        String fileName = sourceFolder.substring(sourceFolder.lastIndexOf("/") + 1);
        if (fileName.startsWith(".")) {
            log.info(".文件忽略" + sourceFolder);
            return;
        }
        for (String path : excludePath) {
            if (path.equalsIgnoreCase(sourceFolder) || fileName.equalsIgnoreCase(path)) {
                return;
            }
        }
        File file = new File(sourceFolder);
        if (!file.exists()) {
            log.error("源文件夹:{}不存在", sourceFolder);
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
            File file2;
            if (depth == 0) {
                file2 = new File(destFolder);
            } else {
                file2 = new File(destFolder + File.separator + file.getName());
            }
            file2.mkdirs();

            //是文件夹，先创建同名文件夹
            File[] files = file.listFiles();
            for (File file1 : files) {
                copyFolderWithDepth(file1.getAbsolutePath(), excludePath, file2.getAbsolutePath() ,depth + 1);
            }
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
                log.error("文件:{}不存在", filePath);
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
