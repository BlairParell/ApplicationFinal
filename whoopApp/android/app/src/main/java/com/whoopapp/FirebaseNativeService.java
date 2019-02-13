package com.whoopapp;

//import android.view.ViewManager;

import android.widget.Toast;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.toast.ToastModule;
import com.facebook.react.uimanager.ViewManager;
import com.google.firebase.iid.FirebaseInstanceIdService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FirebaseNativeService implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext){
        return Collections.emptyList();
    }
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext){
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new FirebaseModule(reactContext));
        return modules;
    }
}
