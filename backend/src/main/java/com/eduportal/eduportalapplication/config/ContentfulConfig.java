package com.eduportal.eduportalapplication.config;

import com.contentful.java.cda.CDAClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ContentfulConfig {

    @Value("${contentful.space-id}")
    private String spaceId;

    @Value("${contentful.access-token}")
    private String accessToken;

    @Value("${contentful.environment}")
    private String environment;

    @Bean
    public CDAClient contentfulClient() {
        return CDAClient.builder()
                .setSpace(spaceId)
                .setToken(accessToken)
                .setEnvironment(environment)
                .build();
    }
}

