package com.example.hybridexample;

import android.app.Application;

public class MyApplication extends Application {

    private String token;
    private String language;

    @Override
    public void onCreate() {
        super.onCreate();
        language = "en";
    }


    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }

}