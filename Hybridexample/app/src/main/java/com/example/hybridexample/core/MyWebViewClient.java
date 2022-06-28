package com.example.hybridexample.core;

import android.webkit.WebSettings;
import android.webkit.WebView;

import com.example.hybridexample.MainActivity;

public class MyWebViewClient extends android.webkit.WebViewClient {

    public MyWebViewClient() {
    }

    public MyWebViewClient(WebView webView) {

        if(webView != null) {

            webView.getSettings().setJavaScriptEnabled(true);
            webView.getSettings().setDomStorageEnabled(true);
            webView.setVerticalScrollBarEnabled(true);

            webView.getSettings().setAppCacheEnabled(true);
            webView.getSettings().setAppCachePath(webView.getContext().getCacheDir().getAbsolutePath());
            webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);

            webView.getSettings().setUseWideViewPort(true);
            webView.getSettings().setLoadWithOverviewMode(true);
            webView.getSettings().setBuiltInZoomControls(false);
            webView.getSettings().setSupportZoom(false);
            webView.getSettings().setDatabaseEnabled(true);
        }
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {

        if (url.contains("401")) {
            ((MainActivity) view.getContext()).getAccessToken();
            return true;
        } else {
            return false;
        }
    }
}
