package com.whoopapp;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.support.v4.app.NotificationManagerCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;
import android.app.NotificationChannel;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class FirebaseService extends FirebaseMessagingService {

    public FirebaseService(){
        super();
        Log.d("Houston", "we have a notification listener");
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage){
        Log.d("Houston", "we have a message");
        //Log.d("Houston", remoteMessage.getNotification().getTitle() + "");
        //Log.d("Houston", remoteMessage.getNotification().getBody() + "");
        if(remoteMessage.getData().size() > 0){
            //use local broadcast receiver to send data to firebase module
            LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
            Intent intent = new Intent("com.whoopApp.NOTIFICATION");
            intent.putExtra("data-here", "this is the data");
            localBroadcastManager.sendBroadcast(intent);
            //Intent intent = new Intent("com.whoopApp.NOTIFICATION");
            createNotificationChannel();
            sendNotification(remoteMessage.getData().get("key"));
            //sendBroadcast(intent);
            Log.d("Houston", "notification data: " + remoteMessage.getData().toString());
            Log.d("Houston", "we have a notification");
        }
    }

    private void sendNotification(String msg){
        Intent intent = new Intent("com.whoopApp.MainApplication");
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
                .setContentTitle("WHOOP!!! APP")
                .setContentText(msg)
                .setSmallIcon(R.drawable.ic_stat_name)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        notificationManager.notify(1, mBuilder.build());
        Log.d("Houston", "we're done sending a notification");
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Incoming Messages";
            String description = "Messages being received";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("1", name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }


    @Override
    public void onDeletedMessages(){
        Log.d("Houston", "we have deleted a message");
    }

}
