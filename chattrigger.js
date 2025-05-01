  const socket = new WebSocket('ws://localhost:3000');

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

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
