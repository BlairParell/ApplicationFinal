package com.whoopapp;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.iid.FirebaseInstanceId;

import static android.content.Context.ACTIVITY_SERVICE;

public class FirebaseModule extends ReactContextBaseJavaModule{
    private Callback tst = null;
    private Callback msgReceived = null;
    private LocalBroadcastReceiver mLocalBroadcastReceiver;
    private ReactContext mReactContext;

    public class LocalBroadcastReceiver extends BroadcastReceiver{
        @Override
        public void onReceive(Context context, Intent intent){
            String someData = intent.getStringExtra("data-here");
            Log.d("Houston", "we have a broadcast");
            //do stuff here
            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("newNotification", Arguments.createMap());
        }
    }
    public FirebaseModule(ReactApplicationContext reactContext){
        super(reactContext);
        Log.d("Houston", "testing");
        this.mReactContext = reactContext;
        this.mLocalBroadcastReceiver = new LocalBroadcastReceiver();
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(reactContext);
        localBroadcastManager.registerReceiver(mLocalBroadcastReceiver, new IntentFilter("com.whoopApp.NOTIFICATION"));
    }
    @Override
    public String getName(){
        return "FirebaseModule";
    }
    @ReactMethod
    public void passNewMessageCallback(Callback msgReceived){
        this.msgReceived = msgReceived;
    }
    @ReactMethod
    public void getFBCMtoken(Callback tst){
        String token = FirebaseInstanceId.getInstance().getToken();
        tst.invoke(token);
        this.tst = tst;
    }
}
