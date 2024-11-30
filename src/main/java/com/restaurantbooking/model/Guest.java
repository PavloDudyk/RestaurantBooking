package com.restaurantbooking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "guests")
@Data
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guestId;

    private String fullName;
    private String phoneNumber;
    private String email;
    private String telegramId;
    private String allergens;
}

