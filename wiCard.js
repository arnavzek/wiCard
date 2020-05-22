	import {LitElement, html, css} from 'https://unpkg.com/lit-element/lit-element.js?module';


	window.removeHTML = function(htm,type){
		console.log(htm)
		if(!type)type = ''
		if(!htm)return ''
		var regex = /(<([^>]+)>)/ig
	 	return htm.replace(regex, type).trim();
	}

    window.wikiAPI = function(keyword,srlimit,finalize,analysisBoolean){
      		return new Promise(resolve=>{

      			if(!srlimit) srlimit = 10


	      		let url = "https://en.wikipedia.org/w/api.php"; 

	      		// old method:https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&titles=pizza
	      		//reson of removal: takes longer to process, 

				var params = {
				    action: "query",
				    list: "search",
				    srsearch: encodeURIComponent(keyword),
				    srlimit:srlimit,
				    explaintext:'1',
				    format: "json"
				};


				if(finalize){
					params.srsearch = finalize
				}

				let callback = resolve

				if(analysisBoolean){

					callback = function(data){
						if(data.query.search.length === 0 ) return resolve(false) 
						keyword = data.query.search[0].title



						params = {
						    action: "query",
						    prop: "extracts",
						    titles: encodeURIComponent(keyword),
						    explaintext:'',
						    format: "json",
						    redirects: '1'
						};

						callback = resolve
						runQuery()
					}
				}
				
				runQuery()
				

				function runQuery(){
					let parsedUrl = url + "?origin=*";
					Object.keys(params).forEach(function(key){parsedUrl += "&" + key + "=" + params[key];});

					fetch(parsedUrl)
					    .then(function(response){return response.json();}).then((data)=>{
					    	callback(data)
					    })
				}
      		})
      	}




	window.capitalizeFirstLetter = function(string) {
		if(!string) return ''
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}



	    class wiCard extends LitElement {

    	static get properties() {
	        return {
	        	title:String,
	        	snippet:String,
	          	image:String,
	          	infobox:String
	        }
      }

      	constructor(){
	      	super()
	      	this.image = ''
	      	this.snippet = ''
	      	this.infobox = ''
      	}


      	firstUpdated(){
	      	wikiAPI(this.title,3).then(newResponse=>{

	      		for(let index of newResponse.query.search){
	      			if(index.snippet.indexOf('refer') === -1){
	      				this.title = index.title
	      				this.initiate()
	      				break
	      			}
	      		}
	      		
	      		
	      	})
      	}

	    initiate(){

	      	let parent = this

	      	let infoboxFetchUrl = 'https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=revisions&rvsection=0&redirects=1&rvprop=content&rvparse&titles='+this.title

			fetch(infoboxFetchUrl).then(function(response){return response.json();}).then((moreData)=>{

				let infoBoxData = ''

				  for (let x in moreData.query.pages) {
				    for(let star in moreData.query.pages[x].revisions[0]){

				        var titleM = moreData.query.pages[x].title;
				        var titleN = titleM.replace(/'/g,"%27");
				        var titleF = titleN.replace(/ /g,"%20");
				        
				        var spots = moreData.query.pages[x].revisions[0][star];
				        var gar = spots.replace(/\/\/upload/g, 'https:upload');
				        var gar0 = gar.replace(/class="image" title/g, 'class="image" total');
				        var garb1 = gar0.replace(/" class="extiw/g, '');
				        var garb2 = garb1.replace(/" title/g, '" title');
				        var garb3 = garb2.replace(/" class="mw-redirect/g, '').replace(/\[1\]/,'');
				        // var places = garb3.replace(/ href=\"\/wiki\//g, ' onclick="return showmore(this.innerHTML)" href="http://heylle.com/?tp=');


				      	infoBoxData += garb3+'<br><br>'; 
				    }
				}

				function parseUl(ul){
					let tempTrParser = document.createElement('ul')
					tempTrParser.innerHTML = ul

					let li = Array.prototype.slice.call( tempTrParser.getElementsByTagName('li') )

					if(li.length === 0) return ul

					let newWord = ''
					for(let index of li){
						newWord += index.innerText+' '
					}
				}

				function parseTr(data){
					let tempTrParser = document.createElement('table')
					tempTrParser.innerHTML = '<tr>'+data.replace(/&nbsp;/gi,'')+'</tr>'


					let td = Array.prototype.slice.call( tempTrParser.getElementsByTagName('td') )
					let th = Array.prototype.slice.call( tempTrParser.getElementsByTagName('th') )


					if(td.length === 0 || th.length === 0) return false
						console.log(td.length,th.length)

					return html`<th>${removeHTML(th[0].innerHTML) }</th> <td>${parseUl(td[0].innerText)}</td>`
				}

				if(!infoBoxData){
					parent.infobox = 'not found'
				}else{
					let tmp = document.createElement('div')
					tmp.innerHTML = infoBoxData
					// console.log(parent.title,infoBoxData)
					let trTags = tmp.getElementsByTagName('tr')
					let trArray = Array.prototype.slice.call(trTags)//converting node list ti array

					if(trTags.length === 0){
						parent.infobox = 'not found'
					}else{

						trArray = trArray.map(item=>parseTr(item.innerHTML))

						trArray = trArray.filter(item=>{
							if(item !==  false) return true
						})

						if(trArray.length === 0){
							parent.infobox = 'not found'
						}else{
							parent.infobox = html`<table>${

								trArray.map(item=>html`<tr>${item}</tr>`)

							}</table>`

						}



					}
				}

		    })


			let imageNSnippetFetch = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&redirects=1&prop=pageimages%7Cextracts&pithumbsize=300&titles=${parent.title}&pilicense=any&exsentences=4&explaintext=1&exsectionformat=plain`

			fetch(imageNSnippetFetch).then(function(response){return response.json();}).then((data)=>{

					
				for (let x in data.query.pages ) {

			        let str = data.query.pages[x].title;
			        let snippet = data.query.pages[x].extract;
			        if(!snippet) snippet = 'Wikipedia Article not found'
			        let c = snippet.length; 

			        if(c > 480) c = 400;
			         

			         if (data.query.pages[x].thumbnail){
			         	parent.image = data.query.pages[x].thumbnail.source;
			         }else{
			         	parent.image = 'not found'
			         }

			         //we are not inheriting snippet because it is very unordered
			         parent.snippet = snippet.substr(0,c)+'...'

			    }

		        


			})


	    }



	    render(){


	      	//why just send them to a link not parse wiki for them, because it is not providing any remarkable advantage, little advantage it shows is when internal links can be accessed without reloading  but generally people like to open a new tab, whyen then stumble upon an unknown topic.
	      	let img = html`loading...`
	      	let infobox = html`loading...`

	      	if(this.image){
	      		this.image === 'not found'? img=html``: img = html`<img src='${this.image}' id="resultIa">`
	      	}

	      	if(this.infobox){
	      		this.infobox === 'not found'? infobox=html``: infobox = html`<span id="infobox">${this.infobox}</span>`
	      	}

	      	let snippetWidth = 'width: 56%;'

	      	if(this.image==='not found'){

	      		snippetWidth = 'width: 80%;'

	      	}else if(this.infobox==='not found' && this.image==='not found'){
	      		snippetWidth = 'width: 95%;'
	      	}

	      	return html`
	      	<div id='wiCard'>
	      	<a  target='_blank' href="http://wikipedia.org/wiki/${this.title }" >

	      		<p id="output-R">

	      			${img}

	      			<span id=moveM style='${snippetWidth}'>
		      			<b>
		      				<medium id="anchor">${capitalizeFirstLetter(this.title)}</medium>
		      			</b><br>
		      			${this.snippet}
	      			</span>

	      			  
	      				${infobox}
	      			

	      		</p>
	      		</a>
	      	</div>


	      `
	      }


	    static get styles() {
		        return css`


				div#wiCard{
				   float:left;
				   width:30%;
				   margin-right: 3%;
				}

				span#infobox .mw-parser-output{
				  display: none;
				}

				span#infobox{
				    width: 36.1vw;
				    display: inline-block;
				    margin-left: -0.1vw;
				    height: auto;
				    margin-top: -0.7vw;
				    margin-bottom: -0.6vw;
				    overflow: hidden;
				    color: #444 !important;
				    width: 100%;
    				margin-top: 2vw;
    				max-height:20vw;
				}

				span#infobox tr{
				    transition: 0.3s ease-in-out;
				    display: block;
				    padding-left: 0;
				    /* margin-top: 0.1vw; */
				    margin-left: -0.1vw;
				    border-radius: 0.2vw;
				    width: 90%;
					margin: 0.5vw;
					background: yellowgreen;
					background: #e0e0e026;

					color: #333;
					height: auto;
					display: inline-block;
					padding: 0.4vw 0;
				}

				  
				span#infobox a{
				  color: #333 !important;
				  transition: 0.3s ease-in-out;
				}

				span#infobox sup{
				  display: none;
				}

				#output-R #moveM{
				    display: inline-block;
				    font-size: 1.5vw;
				    padding-right: 1vw;
				    width: 36vw;
				    height: auto;
				    float: left;
				    margin-left: 1vw;
				    overflow: hidden;
				    line-height: 2.3vw;
				    width: 56%;
				    font-size: 15px;
				    line-height: 1.8vw;
				}

				span#infobox ul{
				  margin:0;
				  padding:0;
				}

				span#infobox ul li{
				float: left;
				margin-left: 0.5vw;
				}

				span#infobox br{
				  display: none;
				}

				span#infobox span{
				  padding-left: 0.5vw ;
				  padding-right: 0.5vw;
				}

				span#infobox tr th{
					width: 40%;
					text-align:left;
					float:left;
				}

				span#infobox tr td{
				  background: transparent !important;
				  width: 57%;
				  font-weight: 400;
				  display: inline-block;
				  float: right;
				}

				span#infobox .image ,span#infobox .mbox-image,span#infobox .mbox-text{
				  display: none;
				}

				span#infobox td[colspan],span#infobox th[colspan]{
				  display: none !important;
				}

				p#output-R medium{
				    font-size: 1.5vw;
				    font-weight:900;
				}

				div#wiCard p#output-R
				{
				    padding-top: 0.5vw;
				    line-height: 1.6vw;
				    color: #444 !important;
				    background-color: hsla(0,0%,100%,1);
				    /* padding-bottom: 2vw; */
				    cursor: pointer;
				    border-radius: 0.2vw;
				    box-shadow: 0vw 0.2vw 2vw rgba(0, 0, 0, 0.26);
				    /* transition: 0.3s ease-in-out; */
				    /* margin-bottom: 2vw; */
				    width: 100%;
				    /* float: left; */
				    height: auto;
				    overflow: hidden;
				    /* padding-right: 1vw; */
				    /* padding-left: 1vw; */
				    text-align: justify;
				    font-weight: 100;
				    margin-top: 0;
				    margin-bottom: 0;
				    border-radius: 0.2vw;
				        border-radius: 2vw;
				    padding: 1vw;
				    border: none;
				    box-shadow: none;
				    background: #f3f3f3;
				    transition:0.25s ease;
				    width: 100%;
				    border-radius: 10% 30% 10% 10%/10% 40% 60% 40%;
				    float: left;
				    padding: 2vw;
				    width: 100%;
				    padding: 1vw;
    				border-radius: 3vw;
    				margin-bottom:2vw;
				}

				div#wiCard p#output-R:hover{
				  color: #222 !important;
				  background-color: hsla(0,0%,100%,1);
				  box-shadow: 0vw 1vw 2vw 2px rgba(0, 0, 0, 0.31);
				  transform:scale(0.95)
				}

				div#wiCard p#output-R:hover span#infobox{
				  color: whitesmoke !important;
				}

				div#wiCard p#output-R:hover span#infobox tr{
				  background-color: hsla(0,0%,95%,1);
				  color: #333;
				}

				div#wiCard p#output-R:hover span#infobox a{
				  color: #333 !important;
				}





				div#wiCard p#output-R #resultIa{
				    transition: ease-in-out 0.2s;
				    overflow: hidden;
				    object-fit: cover;
				    border-radius: 0;
				    float: left;
				    margin-top: -0.5vw;
				    height: auto;
				    width: 30%;
				    border-radius: 3vw;
				    padding: 1vw;
				    padding-left: 0;
				}

				div#wiCard p#output-R #resultI{
				  transition: ease-in-out 0.2s;
				    color: #f3f3f3;
				    display: inline-block;
				    background: radial-gradient(circle, #3f3f3f, #373737, #1a2e29);
				    font-size: 8vw;
				    height: 15vw;
				    width: 22vw;
				    line-height: 14vw;
				    margin-bottom: 0.5vw;
				    margin-right: 1vw;
				    margin-left: -1vw;
				    text-align: center;
				}



		        `
		        	
		        
		  }

    }

    customElements.define('wi-card',wiCard)
