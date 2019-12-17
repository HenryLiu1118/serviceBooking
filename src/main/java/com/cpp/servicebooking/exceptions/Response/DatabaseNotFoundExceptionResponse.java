package com.cpp.servicebooking.exceptions.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DatabaseNotFoundExceptionResponse {
    //private String DatabaseNotFound;
    private String error;
}
