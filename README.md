# wiCard
Wikipedia rich information card, JS component library

Featured App powered by wiCard: <a href='http://booth.upon.one'>Booth App</a>

Demo

![Demo card](https://lh5.googleusercontent.com/n0P0u09gNQxlbpB8B9bbAvzV46zjF-yGIirZW4_L_zh4rPrjVt2IOBMwKH1DI49xcKox1R2B34wr1CRsAk7r=w1128-h987)

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
