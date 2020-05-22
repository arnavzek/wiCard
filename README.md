# wiCard
Wikipedia rich information card, JS component library

Featured App powered by wiCard: <a href='http://booth.upon.one'>Booth App</a>

Demo

<img width='600px' src='https://ibb.co/yqkhnW9'>



How to use?
```
<head>
<script type="module" src="https://cdn.jsdelivr.net/gh/itsarnavsingh/wicard/wiCard.js"></script>
</head>

<body>
	<wi-card title='rick and morty'><wi-card>
</body>
```

* Script must be attached to the head
* Necessary attribute: type='module'  
* Minor mis-spellings can be handled by wiCard 
* Wikipedia page is previewed according to the title attribute provided

Rate Limiting: NONE, It relies on wikipedia api that offers high limits and doesn't require api keys
