package com.movieticket.payment_service.service;

import com.movieticket.payment_service.model.Payment;
import com.movieticket.payment_service.repository.PaymentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository repository;

    public PaymentService(PaymentRepository repository) {
        this.repository = repository;
    }

    public Payment createPayment(Payment payment) {

        payment.setStatus("SUCCESS");

        return repository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return repository.findAll();
    }

    public Payment getPayment(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<Payment> getPaymentByBooking(String bookingId) {
        return repository.findByBookingId(bookingId);
    }

    public Payment updateStatus(String id, String status) {

        Payment payment = repository.findById(id).orElse(null);

        if (payment != null) {
            payment.setStatus(status);
            repository.save(payment);
        }

        return payment;
    }

    public void deletePayment(String id) {
        repository.deleteById(id);
    }

}