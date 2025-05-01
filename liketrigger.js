const socket = new WebSocket('ws://localhost:3000');

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'like') {
      console.log('[LIKE] Триггерим Firebase-логику');

      firebase.database().ref("monsters").once('value', function(snapshot) {
        let titleData = snapshot.val();
        for (let i = 0; i < titleData.length; i++) {
          let holderDiv = document.getElementById("holderDiv");
          let itemMainDiv = createAWithParams("itemMainDiv" + i, "itemMainDiv"),
              item = titleData[i],
              itemTitleDiv = createDivWithParams("itemTitleDiv" + i, "itemTitleDiv", item.id),
              itemPriseDiv = createDivWithParams("itemPriseDiv" + i, "itemDescriptionDiv", item.username),
              itemDescriptionDiv = createDivWithParams("itemDescriptionDiv" + i, "itemTitleDiv", item.hporstr);

          let imageDiv = document.createElement("div");
          let image = document.createElement("img");
          image.src = "images/title" + i + ".png";
          imageDiv.className = "imageDiv";

          holderDiv.appendChild(itemMainDiv);
          itemMainDiv.appendChild(imageDiv);
          imageDiv.appendChild(image);
          itemMainDiv.appendChild(itemTitleDiv);
          itemMainDiv.appendChild(itemDescriptionDiv);
          itemMainDiv.appendChild(itemPriseDiv);
        }
      });
    }

    if (data.type === 'chat') {
      console.log('[CHAT] Получено сообщение из чата:', data.message);

      // Запускаем Firebase-логику при каждом чате
      firebase.database().ref("monsters").once('value', function(snapshot) {
        let titleData = snapshot.val();
        for (let i = 0; i < titleData.length; i++) {
          let holderDiv = document.getElementById("holderDiv");
          let itemMainDiv = createAWithParams("itemMainDiv" + i, "itemMainDiv"),
              item = titleData[i],
              itemTitleDiv = createDivWithParams("itemTitleDiv" + i, "itemTitleDiv", item.id),
              itemPriseDiv = createDivWithParams("itemPriseDiv" + i, "itemDescriptionDiv", item.username),
              itemDescriptionDiv = createDivWithParams("itemDescriptionDiv" + i, "itemTitleDiv", item.hporstr);

          let imageDiv = document.createElement("div");
          let image = document.createElement("img");
          image.src = "images/title" + i + ".png";
          imageDiv.className = "imageDiv";

          holderDiv.appendChild(itemMainDiv);
          itemMainDiv.appendChild(imageDiv);
          imageDiv.appendChild(image);
          itemMainDiv.appendChild(itemTitleDiv);
          itemMainDiv.appendChild(itemDescriptionDiv);
          itemMainDiv.appendChild(itemPriseDiv);
        }
      });
    }

  };

  


  if (data.type === 'chat') {
    console.log('[CHAT] Спавним пушку');
    spawnTowerFromList(userDataFromLikeEvent);
  }



  let holderDiv = document.getElementById("holderDiv"),
mainCont = document.getElementById("main");

function createDivWithParams(id, className, innerHTML){
  let elem = document.createElement("div");
  elem.id = id;
  elem.className = `${className} transitionFast`;
  elem.innerHTML = innerHTML || '';
  return elem
}

function createAWithParams(id, className, innerHTML){
  let elem = document.createElement("a");
  elem.href = "https://www.youtube.com/";
  elem.id = id;
  elem.className = `${className} transitionFast`;
  elem.innerHTML = innerHTML || '';
  return elem
}


firebase.database().ref("towers").once('value', function(snapshot) {
    let titleData = snapshot.val();
    for (let i=0; i<titleData.length; i++){
      let holderDiv = document.getElementById("holderDiv");
      let itemMainDiv = createAWithParams("itemMainDiv" + i, "itemMainDiv"),
      item = titleData[i],
      itemTitleDiv = createDivWithParams("itemTitleDiv" + i, "itemTitleDiv", item.id),
      itemPriseDiv = createDivWithParams("itemPriseDiv" + i, "itemDescriptionDiv", item.username);
      itemDescriptionDiv = createDivWithParams("itemDescriptionDiv" + i, "itemTitleDiv", item.hporstr);
      let imageDiv = document.createElement("div");
      let image = document.createElement("img");
      image.src = "images/title" + i + ".png";
      imageDiv.className = "imageDiv";
      
  
      holderDiv.appendChild(itemMainDiv);
      itemMainDiv.appendChild(imageDiv);
      imageDiv.appendChild(image);
      itemMainDiv.appendChild(itemTitleDiv);
      itemMainDiv.appendChild(itemDescriptionDiv);
      itemMainDiv.appendChild(itemPriseDiv);
    };
  });

  firebase.database().ref("monsters").once('value', function(snapshot) {
    let titleData = snapshot.val();
    for (let i=0; i<titleData.length; i++){
      let holderDiv = document.getElementById("holderDiv");
      let itemMainDiv = createAWithParams("itemMainDiv" + i, "itemMainDiv"),
      item = titleData[i],
      itemTitleDiv = createDivWithParams("itemTitleDiv" + i, "itemTitleDiv", item.id),
      itemPriseDiv = createDivWithParams("itemPriseDiv" + i, "itemDescriptionDiv", item.username);
      itemDescriptionDiv = createDivWithParams("itemDescriptionDiv" + i, "itemTitleDiv", item.hporstr);
      let imageDiv = document.createElement("div");
      let image = document.createElement("img");
      image.src = "images/title" + i + ".png";
      imageDiv.className = "imageDiv";
      
  
      holderDiv.appendChild(itemMainDiv);
      itemMainDiv.appendChild(imageDiv);
      imageDiv.appendChild(image);
      itemMainDiv.appendChild(itemTitleDiv);
      itemMainDiv.appendChild(itemDescriptionDiv);
      itemMainDiv.appendChild(itemPriseDiv);
    };
  });

  const membertitleData = document.getElementById("membertitle"),
memberdivTitle = document.getElementById("divTitle"),
memberageData = document.getElementById("memberage"),
memberdescriptionData = document.getElementById("memberdescription"),
addButton = document.getElementById("addButton"),
enableButton = document.getElementById("enableButton"),
database = firebase.database(),
memberrootref = database.ref('towers');

let memberdataLength;

firebase.database().ref("towers").once('value', function(snapshot) {
  let titleData = snapshot.val();
  memberdataLength = titleData.length;
});


addButton.addEventListener('click', (e) => {
  e.preventDefault();
  memberrootref.child(memberdataLength).set({
    id: membertitleData.value,
    hporstr: memberageData.value,
    username: memberdescriptionData.value,
  })
});

enableButton.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.database().ref("towers").once('value', function(snapshot) {
        let titleData = snapshot.val();
        for (let i=0; i<titleData.length; i++){
          let holderDiv = document.getElementById("holderDiv");
          let itemMainDiv = createAWithParams("itemMainDiv" + i, "itemMainDiv"),
          item = titleData[i],
          itemTitleDiv = createDivWithParams("itemTitleDiv" + i, "itemTitleDiv", item.id),
          itemPriseDiv = createDivWithParams("itemPriseDiv" + i, "itemDescriptionDiv", item.username);
          itemDescriptionDiv = createDivWithParams("itemDescriptionDiv" + i, "itemTitleDiv", item.hporstr);
          let imageDiv = document.createElement("div");
          let image = document.createElement("img");
          image.src = "images/title" + i + ".png";
          imageDiv.className = "imageDiv";
          
      
          holderDiv.appendChild(itemMainDiv);
          itemMainDiv.appendChild(imageDiv);
          imageDiv.appendChild(image);
          itemMainDiv.appendChild(itemTitleDiv);
          itemMainDiv.appendChild(itemDescriptionDiv);
          itemMainDiv.appendChild(itemPriseDiv);
        };
      });
  });





  <div class="innerDiv">
  <form>
    <div id = "memberdivtitle" class="divTitle">Добавление члена банды</div>
    <lable for="membertitledivTitle"></lable><br/>
    <lable for="membertitle">Имя</lable><br/>
    <input type="text" name="membertitle" id="membertitle"><br/>
    <lable for="memberage">Возраст</lable><br/>
    <input type="number" name="memberage" id="memberage"><br/>
    <lable for="memberdescription">Описание артиста</lable><br/>
    <input type="text" name="memberdescription" id="memberdescription"><br/>
    <button id="addButton" class="button">Добавить данные</button>
    <button id="enableButton" class="button">Обновить данные</button>      
  </form>
</div>