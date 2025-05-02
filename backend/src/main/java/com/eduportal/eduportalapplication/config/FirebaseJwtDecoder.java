package com.eduportal.eduportalapplication.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
@Primary
public class FirebaseJwtDecoder implements JwtDecoder {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseJwtDecoder.class);

    private final FirebaseAuth firebaseAuth;

    public FirebaseJwtDecoder(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            FirebaseToken firebaseToken = firebaseAuth.verifyIdToken(token);

            Map<String, Object> originalClaims = firebaseToken.getClaims();
            Map<String, Object> processedClaims = new HashMap<>(originalClaims);

            convertTimestampClaims(processedClaims);

            return Jwt.withTokenValue(token)
                    .header("alg", "RS256")
                    .header("typ", "JWT")
                    .header("kid", "firebase")
                    .subject(firebaseToken.getUid())
                    .claims(claimsMap -> claimsMap.putAll(processedClaims))
                    .build();
        } catch (Exception e) {
            logger.error("Firebase token validation failed", e);
            throw new JwtException("Error validating Firebase token: " + e.getMessage(), e);
        }
    }

    /**
     * Converts all known timestamp claims from Long to Instant
     */
    private void convertTimestampClaims(Map<String, Object> claims) {
        String[] timestampFields = {
                JwtClaimNames.IAT,
                JwtClaimNames.EXP,
                JwtClaimNames.NBF,
                "auth_time"
        };
        for (String field : timestampFields) {
            convertTimestampClaim(claims, field);
        }
    }

    /**
     * Converts a single timestamp claim from Long to Instant
     */
    private void convertTimestampClaim(Map<String, Object> claims, String claimName) {
        if (claims.containsKey(claimName)) {
            Object claimValue = claims.get(claimName);

            if (claimValue instanceof Number) {
                long epochSeconds = ((Number) claimValue).longValue();
                claims.put(claimName, Instant.ofEpochSecond(epochSeconds));
                logger.debug("Converted {} timestamp: {} to Instant", claimName, epochSeconds);
            } else if (!(claimValue instanceof Instant)) {
                logger.warn("Expected timestamp for claim {}, but found {}",
                        claimName, claimValue.getClass().getName());
            }
        }
    }
}