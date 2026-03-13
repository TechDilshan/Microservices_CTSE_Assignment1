package com.movieticket.payment_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String bookingId;

    private String userId;

    private Double amount;

    private String method;

    private String status;

}