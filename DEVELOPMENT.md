# DEVELOPMENT.md
This file describes the development of the project, TiSensible.

# Setup Capacitor
After setting up web project using vite, run the following commands.

```shell
# Install capacitor core
npm i @capacitor/core
npm i -D @capacitor/cli

# Initialize capacitor
npx cap init

# Install android platform
npm i @capacitor/android
npx cap add android
```

To run android app:
```shell
npx cap run android
```

You need to have android sdk and point the directory with `ANDROID_HOME` env to run android app.
Check <https://developer.android.com/tools/variables>.
And this: <https://github.com/ionic-team/native-run/issues/235>.
As of February 2026, they say they need `ANDROID_SDK_ROOT` which is deprecated by android studio,
but it does actually use `ANDROID_HOME`.

You can find your android sdk direcotry at *android studio* > *SDK Manager*.

But running the app for the first time with the CLI command failed:
```
✔ Copying web assets from dist to android/app/src/main/assets/public in 5.09ms
✔ Creating capacitor.config.json in android/app/src/main/assets in 552.76μs
[info] Inlining sourcemaps
✔ copy android in 22.37ms
✔ Updating Android plugins in 3.07ms
✔ update android in 23.73ms
✔ Please choose a target device: › samsung SM-S921N
✖ Running Gradle build - failed!
[error]
        > Configure project :app
        WARNING: Using flatDir should be avoided because it doesn't support any meta-data formats.

        > Configure project :capacitor-cordova-android-plugins
        WARNING: Using flatDir should be avoided because it doesn't support any meta-data formats.

        FAILURE: Build failed with an exception.

        * What went wrong:
        Could not determine the dependencies of task ':app:packageDebug'.
        > Could not create task ':app:compileDebugJavaWithJavac'.
        > Failed to calculate the value of task ':app:compileDebugJavaWithJavac' property 'javaCompiler'.
        > Toolchain installation '/usr/lib/jvm/java-21-openjdk' does not provide the required capabilities:
        [JAVA_COMPILER]

        * Try:
        > Run with --stacktrace option to get the stack trace.
        > Run with --info or --debug option to get more log output.
        > Run with --scan to get full insights.
        > Get more help at https://help.gradle.org.

        BUILD FAILED in 9s
```

I tried to run the build inside android studio and it succeeded for nothing...?
I thought it was the problem with jdk so I set `JAVA_HOME` to android studio's one (You can find the path in *android studio* > *build tools* > *gradle*.
And it worked.

# Set Version
To set the app version, you need to change the clients' files manually.
<https://github.com/ionic-team/capacitor/issues/840>

# Safe Area
Starting with android 15, edge-to-edge is encforced. So contents inside webview is expected to
overlap with system bars, so need extra cares.

There are two related capacitor plugins: Status Bar and System Bar.
Briefly *System Bars* is to support modern edge to edge cases.
If you want to opt out the overlapping, set this configurations,
and use `var(--safe-area-inset-top, env(safe-area-inset-top, 0px))` and others inside css styles.
```ts
// capacitor config
{
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
    },
  },
}
```

# Compass
capacitor provides its official plugin for compass: <https://capacitorjs.com/docs/apis/motion>
However since it says it is implemented using Web APIs, so the feature is implemented using direct Web APIs.

You can get the rotation of the device relative to the earth coordinate system,
by magnetometer sensor with `'deviceorientationabsolute'`.
*absolute* means it provides relative to the earth's magnetic field.
But not every feature should be built with magnetometer;
it can be affected by nearby magnetic things, resulting in unwanted behaviors.
Starting with Chrome 50, the original `'deviceorientation'` changed
from magnetometer to accelerometer and gyroscope.
<https://developer.chrome.com/blog/device-orientation-changes>

If the event is based on the earth's magnetic pole, it will have `absolute` property set to `true`.
Be careful! without it, the value cannot be trusted!

The value you need is `alpha`. The alpha angle is 0° when the top of the device is pointing
to the north pole, and increases towards the west, south, and east.
Thus when the device is pointing the west, the `alpha` value is 270°.
>The alpha angle is 0° when top of the device is pointed directly toward the Earth's north pole, and increases as the device is rotated counterclockwise. As such, 90° corresponds with pointing west, 180° with south, and 270° with east.\
><https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained>

# Geolocation
Capacitor geolocation plugin source code is here:
capacitor plugin: <https://github.com/ionic-team/capacitor-geolocation/blob/main/android/src/main/kotlin/com/capacitorjs/plugins/geolocation/GeolocationPlugin.kt>
ionic plugin: <https://github.com/ionic-team/ion-android-geolocation/blob/main/src/main/kotlin/io/ionic/libs/iongeolocationlib/controller/IONGLOCController.kt>

## Geographic Coordinates
Location object from Geolocation API contains geographic coordinates, comprised of latitude and longitude.
They are denoted as decimal degrees and range within ±90° and ±180° respectively.
>As with latitude and longitude, the values are bounded by ±90° and ±180° respectively.
><https://en.wikipedia.org/wiki/Decimal_degrees>

Negative latitude and longitude mean the south of the equator and the west of the prime meridiean respectively.
>Positive latitudes are north of the equator, negative latitudes are south of the equator.
>Positive longitudes are east of the Prime Meridian; negative longitudes are west of the Prime Meridian.
><https://en.wikipedia.org/wiki/Decimal_degrees>

## Speed
The object returned by may have `speed` value and on android this value may be more accurate than the manual `distance / time` value. So it is good to display the value if available.
The speed value is in `meter / second`.
<https://developer.android.com/reference/android/location/Location#getSpeed()>

However, if the value is not available, you need to get it from the two continual geographical coordinates.

## Haversine Formula
Haversine fourmula calculates the distance between the two points along the arc on the earth.
This is more precise than the euclidean distance which finds the straight line, tunnel distance.
However, it is an approximation; it assumes that the earth is an perfect sphere.
But it is still a great approximation and is easy to understand and implement.

```ts
console.log(getDistWithHaversine({latitude: 38.898, longitude: -77.037}, {latitude: 48.858, longitude: 2.294}));
// 6161438.034825136
```

<https://en.wikipedia.org/wiki/Haversine_formula>
<https://www.math.ksu.edu/~dbski/writings/haversine.pdf>

### Floating Point Precision
Usually, as the characteristics of this app, the distances you will get are mostly really short, having small *radian*s.
For instance, say the earth radius is 6371km and the distance is 1km, then the radian is 0.000156961230576.

When radians are near zero, using cosine function to get haversine values for such tiny radians is not a good idea.
Cosine function's derivative at 0 is zero. It is hard to distinguish such small differences.
Meanwhile sine function's derivative at 0 is 1. Compared to cosine it drastically increases having big delta values.
This is because of the nature of floating point arithmetic. It is destined to have errors.

Notice that cosine function gets fixated at 1, while sine function keeps changing.
```js
for (let i = 0;i < 10;++i) {
  const radian = 1 / 6371 / (10 ** i);
  console.log(i, radian, Math.cos(radian), Math.sin(radian));
}
```

This code shows getting haversine values using two different methods.
Notice that the result using cosine function sits to zero, while the other still emits non-zero.
```js
for (let i = 0;i < 10;++i) {
  const radian = 1 / 6371 / (10 ** i);
  console.log(i, radian, (1 - Math.cos(radian)) / 2, Math.sin(radian / 2) ** 2);
}
```

Without knowing the implementation it cannot be guaranteed,
but using arctan to get radian from haversine gives better results.
Here you consider positive square roots only, then arctan function will give you the value between 0 and π / 2.
And you need to double it, then you will get the radian value between 0 and π, the direct opposite side of the earth.
```js
for (let i = 0;i < 10;++i) {
  const radian = 1 / 6371 / (10 ** i);
  console.log(i, radian, Math.acos(Math.cos(radian)), Math.atan2(Math.sin(radian), Math.cos(radian)));
}
```

<https://en.wikipedia.org/wiki/Catastrophic_cancellation>
<https://math.stackexchange.com/questions/1126970/explain-why-catastrophic-cancellation-happens>
