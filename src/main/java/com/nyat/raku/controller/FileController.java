package com.nyat.raku.controller;

import com.nyat.raku.model.FileInfo;
import com.nyat.raku.payload.ApiResponse;
import com.nyat.raku.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private FileStorageService storageService;

    @PostMapping("/upload")
    @ResponseBody
    public ApiResponse<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            storageService.save(file);
            return new ApiResponse<>(true, file.getOriginalFilename());
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, "Could not upload the file: " + file.getOriginalFilename() + "!");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<FileInfo>> getListFiles() {
        List<FileInfo> fileInfos = storageService.loadAll().map(path -> {
            String filename = path.getFileName().toString();
            String url = MvcUriComponentsBuilder
                    .fromMethodName(FileController.class, "getFile", path.getFileName().toString()).build().toString();
            return new FileInfo(filename, url);
        }).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
    }

    @GetMapping("/download/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.load(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }
}