//package com.cloudwise.lcap.dataplateform.service;
//
//
//import org.springframework.util.ResourceUtils;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//import org.springframework.web.multipart.MultipartHttpServletRequest;
//
//import javax.servlet.http.HttpServletRequest;
//import java.io.*;
//import java.text.SimpleDateFormat;
//import java.util.*;
//
//@RestController
//public class UploadController {
//
//    private String uploadPath="";
//
//    public final static String UPLOAD_PATH_PREFIX = "src/main/resources/static";
//
//
//    // 单文件上传
//    @RequestMapping("/file/upload")
//    public Object fileUpload(@RequestParam("file") MultipartFile multipartFile, HttpServletRequest request) {
//        Map<String, Object> map = new HashMap();
//        map.put("msg", "上传成功");
//
//        if (multipartFile.isEmpty()) {
//            map.put("msg", "空文件");
//            return map;
//        }
//
//        // 获取文件名
//        String fileName = multipartFile.getOriginalFilename();
//        if ("".equals(fileName)) {
//            map.put("msg", "文件名不能为空");
//            return map;
//        }
//        System.out.println("上传文件原始的名字: " + fileName);
//
//
//        // 生成以日期分割的文件路径
//        File readPath = new File(UPLOAD_PATH_PREFIX + uploadPath + File.separator);
//        System.out.println("存放的文件夹: " + readPath);
//        System.out.println("存放文件的绝对路径: " + readPath.getAbsolutePath());
//        // 判断文件夹是否存在
//        if (!readPath.isDirectory()) {
//            // 创建文件夹
//            readPath.mkdirs();
//        }
//
//        // 文件真实的保存路径
//        File file = new File(readPath.getAbsolutePath() + File.separator + fileName);
//        try {
//            multipartFile.transferTo(file);
//            String filePath =  request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + uploadPath + "/" + fileName;
//            map.put("path", filePath);
//        } catch (IOException e) {
//            e.printStackTrace();
//            map.put("msg", "上传失败");
//        }
//
//        return map;
//    }
//
//    // 传统手艺
//    @PostMapping("/upload")
//    public Object upload(@RequestParam("file") MultipartFile multipartFile) {
//        Map<String, Object> map = new HashMap();
//        map.put("msg", "上传成功");
//
//        if (multipartFile.isEmpty()) {
//            return "文件不能为空";
//        }
//
//        String fileName = multipartFile.getOriginalFilename();
//        if ("".equals(fileName)) {
//            return "文件名不能为空";
//        }
//        System.out.println("文件名: " + fileName);
//
//        File readPath = new File(UPLOAD_PATH_PREFIX + uploadPath + File.separator + "temp");
//        if (!readPath.isDirectory()) {
//            readPath.mkdirs();
//        }
//        System.out.println("保存路径: " + readPath);
//
//        InputStream is = null;
//        FileOutputStream os = null;
//        try {
//            is = multipartFile.getInputStream();
//            os = new FileOutputStream(new File(readPath, fileName));
//
//            int len = 0;
//            byte[] bytes = new byte[1024];
//            while ((len = is.read(bytes)) != -1) {
//                os.write(bytes, 0, len);
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//            map.put("msg", "上传失败");
//        } finally {
//            try {
//                is.close();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//            try {
//                os.close();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
//
//        return map;
//    }
//
//    // 多文件上传
//    @PostMapping("/uploads")
//    public String uploads(HttpServletRequest request) {
//        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles("file");
//
//        for (MultipartFile file : files) {
//            if (file.isEmpty()) {
//                return file.getOriginalFilename() + "上传失败";
//            }
//
//            File readPath = new File(UPLOAD_PATH_PREFIX + uploadPath + File.separator + "temps");
//            System.out.println("多文件上传的位置: " + readPath);
//            System.out.println("多文件上传的绝对路径: " + readPath.getAbsolutePath());
//            if (!readPath.isDirectory()) {
//                readPath.mkdirs();
//            }
//
//            File dest = new File(readPath.getAbsolutePath() + File.separator + file.getOriginalFilename());
//            try {
//                file.transferTo(dest);
//            } catch (IOException e) {
//                e.printStackTrace();
//                return file.getOriginalFilename() + "上传失败";
//            }
//        }
//
//        return "上传成功";
//    }
//}