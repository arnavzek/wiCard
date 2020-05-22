# wiCard
Wikipedia rich information card, JS component library

Featured App powered by wiCard: <a href='http://booth.upon.one'>Booth App</a>

Demo

![Demo card](https://drive.google.com/file/d/1e69xsdQdm9q5-_YBIAJp1z95Ru4Qav9I)

How to use?
```
<head>
<script type="module" src="./wiCard.js"></script>
</head>

<body>
	<wi-card title='rick and morty'><wi-card>
</body>
```

* Script must be attached to the head
* type module is necessary
* wiCard can handle minor mis-spellings
* title artibute describes the wikipedia page to be previewed

Rate Limiting: NONE, It relies on wikipedia api that offers high limits and doesn't require api keys
