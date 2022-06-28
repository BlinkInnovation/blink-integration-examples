package com.example.hybridexample.core;

public interface WebFragment {
    void updateWebView(boolean force);
    default void updateWebView() { this.updateWebView(false);}
}
