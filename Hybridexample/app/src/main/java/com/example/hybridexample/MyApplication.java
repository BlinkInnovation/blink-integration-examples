package com.example.hybridexample;

import android.app.Application;

public class MyApplication extends Application {

    private String token;
    private String branding;

    @Override
    public void onCreate() {
        super.onCreate();
        branding = getString(R.string.branding);
    }


    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public String getBranding() {
        return branding;
    }
    public void setBranding(String branding) {
        this.branding =  branding;
    }

}