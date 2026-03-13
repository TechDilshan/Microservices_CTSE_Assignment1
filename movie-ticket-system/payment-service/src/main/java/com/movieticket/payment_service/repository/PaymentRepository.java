package com.movieticket.payment_service.repository;

import com.movieticket.payment_service.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByBookingId(String bookingId);

}