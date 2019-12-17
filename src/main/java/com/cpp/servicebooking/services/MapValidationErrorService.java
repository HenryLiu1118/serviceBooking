package com.cpp.servicebooking.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MapValidationErrorService {
    public ResponseEntity<?> MapValidationService(BindingResult result){

        if(result.hasErrors()){
            //Map<String, String> errorMap = new HashMap<>();

            //for(FieldError error: result.getFieldErrors()){
                //errorMap.put(error.getField(), error.getDefaultMessage());
            //}
            List<String> errors = new ArrayList<>();
            for (FieldError error: result.getFieldErrors()) {
                errors.add(error.getDefaultMessage());
            }
            Map<String, List<String>> ans = new HashMap<>();
            ans.put("errors", errors);
            return new ResponseEntity<>(ans, HttpStatus.BAD_REQUEST);
        }

        return null;

    }
}
