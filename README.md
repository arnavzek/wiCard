# wiCard
Wikipedia rich information card, JS component library

Featured App powered by wiCard: <a href='http://booth.upon.one'>Booth App</a>

Demo
<img src="https://i.ibb.co/7gzjwYW/rr.png"  border="0">


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

#Attributes

title: search keyword
maxProp: maximum properties count of the specified wikipedia page / Default:5 / optional 

Rate Limiting: NONE, It relies on wikipedia api that offers high limits and doesn't require api keys
