package com.example.hybridexample;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.Menu;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.example.hybridexample.core.WebFragment;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.navigation.NavigationView;

import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import com.example.hybridexample.databinding.ActivityMainBinding;

import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    private ActivityMainBinding binding;

    Handler handler = new Handler();
    private boolean fetching;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.appBarMain.toolbar);
        binding.appBarMain.fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.nav_insurance, R.id.nav_passenger, R.id.nav_account)
                .setOpenableLayout(drawer)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        handler.postDelayed(dashboard, 5000);

        getAccessToken();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.branding_baseline:
                setBranding("baseline");
                return true;
            case R.id.branding_bluecross:
                setBranding("bluecross");
                return true;
            case R.id.branding_tugo:
                setBranding("tugo");
                return true;
            case R.id.branding_justtravel:
                setBranding("justtravel");
                return true;
            case R.id.branding_demo1:
                setBranding("direct-line");
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    public void setBranding(String branding) {

        ((MyApplication) MainActivity.this.getApplication()).setBranding(branding);

        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment_content_main);
        Fragment fragment = navHostFragment.getChildFragmentManager().getFragments().get(0);
        if (fragment instanceof WebFragment) {
            ((WebFragment) fragment).updateWebView(true);
        }
    }
    public synchronized void getAccessToken() {

        if(fetching) {

            return;
        }
        fetching = true;

        ((MyApplication) MainActivity.this.getApplication()).setToken(null);
        Toast toast = Toast.makeText(MainActivity.this, "Authenticating", Toast.LENGTH_LONG);
        toast.show();

        String url = getString(R.string.api_url) + "/v1/platform/user/sso";
        StringRequest request = new StringRequest(Request.Method.POST, url, new com.android.volley.Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                Toast toast = Toast.makeText(MainActivity.this, "Authenticated", Toast.LENGTH_LONG);
                toast.show();

                fetching = false;

                try {

                    JSONObject respObj = new JSONObject(response);
                    onAccessToken(respObj.getString("accessToken"));

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new com.android.volley.Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("error is ", "" + error.getMessage());

                Toast toast = Toast.makeText(MainActivity.this, "Fail to get response = \" + error", Toast.LENGTH_LONG);
                toast.show();

                fetching = false;
            }
        }) {
            @Override
            public byte[] getBody() throws AuthFailureError {

                JSONObject JObj = new JSONObject();
                try {
                    JObj.put("emailAddress",getString(R.string.emailAddress));
                    JObj.put("clientId",getString(R.string.clientId));
                    JObj.put("clientSecret",getString(R.string.clientSecret));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return JObj.toString().getBytes(StandardCharsets.UTF_8);
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {

                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json");
                headers.put("x-api-key", getString(R.string.apiKey));
                return headers;
            }

        };
        RequestQueue queue = Volley.newRequestQueue(MainActivity.this);
        queue.add(request);
    }

    private void onAccessToken(String token) {

        ((MyApplication) MainActivity.this.getApplication()).setToken(token);
        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment_content_main);
        Fragment fragment = navHostFragment.getChildFragmentManager().getFragments().get(0);
        if (fragment instanceof WebFragment) {
            ((WebFragment) fragment).updateWebView();
        }
    }

    Runnable dashboard = new Runnable() {

        @Override
        public void run() {

            NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment_content_main);
            navHostFragment.getNavController().popBackStack(R.id.nav_splash, true);
            navHostFragment.getNavController().navigate(R.id.nav_home);
            binding.appBarMain.layout.setVisibility(View.VISIBLE);

        }
    };
}