package com.ecosphere.controller;

import com.ecosphere.dto.LeaderboardDto;
import com.ecosphere.dto.LeaderboardResponse;
import com.ecosphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final UserRepository userRepository;

    @GetMapping("/ward")
    public List<LeaderboardResponse> getWardLeaderboard() {
        List<LeaderboardDto> topUsers = userRepository.findTopCommunityContributors(PageRequest.of(0, 20));
        
        List<LeaderboardResponse> response = new ArrayList<>();
        int rank = 1;
        for (LeaderboardDto dto : topUsers) {
            response.add(new LeaderboardResponse(
                    rank++,
                    dto.getUserId(),
                    dto.getUserName(),
                    dto.getTotalUpvotes()
            ));
        }
        return response;
    }
}
