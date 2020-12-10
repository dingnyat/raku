package com.nyat.raku.util.paypal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Component
public class PaypalService {

    @Autowired
    private PaypalProperties properties;

    private final RestTemplate http = new RestTemplate();

    private AccessToken accessToken;

    private final String ENDPOINT = "https://api-m.sandbox.paypal.com";

    public void resetAccessToken() {
        System.out.println("Reset Paypal Access Token");
        this.accessToken = getAccessToken();
        if (accessToken != null) {
            System.out.println(accessToken.getAccess_token());
        }
    }

    private AccessToken getAccessToken() {
        String url = this.ENDPOINT + "/v1/oauth2/token";
        String basicAuth = Base64.getEncoder().encodeToString((properties.getClientId() + ":" + properties.getSecret()).getBytes());
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + basicAuth);
        headers.set("Content-Type", "application/x-www-form-urlencoded");
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "client_credentials");
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        try {
            return http.postForObject(url, request, AccessToken.class);
        } catch (Exception e) {
            if (e instanceof HttpClientErrorException) {
                System.err.println("URL: " + url);
                System.err.println("Response Status Code: " + ((HttpClientErrorException) e).getStatusCode());
                System.err.println("Response Body: " + ((HttpClientErrorException) e).getResponseBodyAsString());
            } else {
                System.err.println(e.getClass().toString() + " : " + e.getMessage());
            }
            return null;
        }
    }

    public void getTransactions() {
        String url = this.ENDPOINT + "/v1/reporting/transactions";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", accessToken.getToken_type() + " " + accessToken.getAccess_token());
        headers.set("Content-Type", "application/json");
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(null, headers);
        try {
            http.exchange(url, HttpMethod.GET, request, String.class);
        } catch (Exception e) {
            if (e instanceof HttpClientErrorException) {
                System.err.println("URL: " + url);
                System.err.println("Response Status Code: " + ((HttpClientErrorException) e).getStatusCode());
                System.err.println("Response Body: " + ((HttpClientErrorException) e).getResponseBodyAsString());
            } else {
                System.err.println(e.getClass().toString() + " : " + e.getMessage());
            }
        }
    }
}
