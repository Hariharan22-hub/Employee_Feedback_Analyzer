package com.employeefeedback.dto;

import com.employeefeedback.model.Role;

public class UserDto {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String department;
    private Role role;

    public UserDto() {
    }

    public UserDto(Long id, String name, String username, String email, String department, Role role) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.department = department;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
