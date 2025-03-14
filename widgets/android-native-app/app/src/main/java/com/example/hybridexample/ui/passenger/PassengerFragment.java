package com.example.hybridexample.ui.passenger;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.hybridexample.MyApplication;
import com.example.hybridexample.R;
import com.example.hybridexample.core.WebFragment;
import com.example.hybridexample.databinding.FragmentPassengerBinding;
import com.example.hybridexample.core.MyWebViewClient;

public class PassengerFragment extends Fragment implements WebFragment  {

    private FragmentPassengerBinding binding;
    WebView webView;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentPassengerBinding.inflate(inflater, container, false);
        View root = binding.getRoot();
        webView = root.findViewById(R.id.web_app_view);
        webView.setWebViewClient(new MyWebViewClient(webView));

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            updateWebView();
        }
        return root;
    }

    @Override
    public void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    public void updateWebView(boolean forced) {

        MyApplication application = ((MyApplication) getActivity().getApplication());
        String token = application.getToken();
        String language = application.getLanguage();

        if(token != null || forced) {
            webView.loadUrl(getString(R.string.website_url)+"/widgets/account/passengers?basic=true&token=" + token + "&lang=" + language);
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}