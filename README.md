# Mendix Card Scanner
This Mendix widget allows your users to open up a scanner on their mobile phone and scan a credit or debit card. The widget will read the card numbers and name then assign these to Mendix attributes. This widget utilizes the card.io technology and only works when wrapped as a native app.


## Installation
In order to use this widget you need to include the following plugin in your config.xml

```<plugin spec="https://github.com/card-io/card.io-Cordova-Plugin.git" source="git"/>```

The widget needs to be placed in a dataview. If you require the expiry, cvv and cardholders name you will need to select the appropriate attribute.

### Data
![Data Setup][1]

### Setup
![Setup][2]

### Appearance
![Appearance][3]

[1]: img/DataSetup.png
[2]: img/Setup.png
[3]: img/Appearance.png
