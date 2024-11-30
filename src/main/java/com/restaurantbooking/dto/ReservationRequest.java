package com.restaurantbooking.dto;

import lombok.Data;

@Data
public class ReservationRequest {
    private String fullName;
    private String phoneNumber;
    private String email;
    private String telegramId;
    private String allergens;
    private String reservationDate;
    private String reservationTime;
    private int tableNumber;

    private int guestCount;
}