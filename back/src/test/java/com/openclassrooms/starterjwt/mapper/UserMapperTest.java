package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    public void setUp() {
        userMapper = Mappers.getMapper(UserMapper.class);
    }

    @Test
    public void testToEntity() {
        UserDto userDto = new UserDto(1L, "test@example.com", "Doe", "John", true, "password", LocalDateTime.now(), LocalDateTime.now());
        User user = userMapper.toEntity(userDto);

        assertNotNull(user);
        assertEquals(userDto.getId(), user.getId());
        assertEquals(userDto.getEmail(), user.getEmail());
        assertEquals(userDto.getLastName(), user.getLastName());
        assertEquals(userDto.getFirstName(), user.getFirstName());
        assertEquals(userDto.isAdmin(), user.isAdmin());
        assertEquals(userDto.getPassword(), user.getPassword());
        assertEquals(userDto.getCreatedAt(), user.getCreatedAt());
        assertEquals(userDto.getUpdatedAt(), user.getUpdatedAt());
    }

    @Test
    public void testToDto() {
        User user = new User(1L, "test@example.com", "Doe", "John", "password", true, LocalDateTime.now(), LocalDateTime.now());
        UserDto userDto = userMapper.toDto(user);

        assertNotNull(userDto);
        assertEquals(user.getId(), userDto.getId());
        assertEquals(user.getEmail(), userDto.getEmail());
        assertEquals(user.getLastName(), userDto.getLastName());
        assertEquals(user.getFirstName(), userDto.getFirstName());
        assertEquals(user.isAdmin(), userDto.isAdmin());
        assertEquals(user.getPassword(), userDto.getPassword());
        assertEquals(user.getCreatedAt(), userDto.getCreatedAt());
        assertEquals(user.getUpdatedAt(), userDto.getUpdatedAt());
    }

    @Test
    public void testToEntityList() {
        UserDto userDto1 = new UserDto(1L, "test1@example.com", "Doe", "John", true, "password", LocalDateTime.now(), LocalDateTime.now());
        UserDto userDto2 = new UserDto(2L, "test2@example.com", "Smith", "Jane", false, "password", LocalDateTime.now(), LocalDateTime.now());
        List<UserDto> userDtoList = Arrays.asList(userDto1, userDto2);

        List<User> userList = userMapper.toEntity(userDtoList);

        assertNotNull(userList);
        assertEquals(2, userList.size());
        assertEquals(userDto1.getId(), userList.get(0).getId());
        assertEquals(userDto2.getId(), userList.get(1).getId());
    }

    @Test
    public void testToDtoList() {
        User user1 = new User(1L, "test1@example.com", "Doe", "John", "password", true, LocalDateTime.now(), LocalDateTime.now());
        User user2 = new User(2L, "test2@example.com", "Smith", "Jane", "password", false, LocalDateTime.now(), LocalDateTime.now());
        List<User> userList = Arrays.asList(user1, user2);

        List<UserDto> userDtoList = userMapper.toDto(userList);

        assertNotNull(userDtoList);
        assertEquals(2, userDtoList.size());
        assertEquals(user1.getId(), userDtoList.get(0).getId());
        assertEquals(user2.getId(), userDtoList.get(1).getId());
    }
}
