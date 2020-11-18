/*global $*/
(function(){
    'use strict';

    class MenuItem{
        constructor(name, price, imageSrc){
            this.name = name;
            this.price = Number(price);
            this.imageSrc = imageSrc;
        }

        // toHtml(){
        // return `<li class="menuItem"><div><img src="${this.imageSrc}" /><p>${this.name} $${this.price}</p></div></li>`;
        // }
    }

    class Order{
        constructor(...items){
            this.orderItems =items ||[];
        }

        get total(){
            let total = 0;
          this.orderItems.forEach((item)=>{
            total+= item.price;
          });
          return total;
        }
        add(item){
            this.orderItems.push(item);
        }
    }

    //const orderTest = new Order(new MenuItem("carrots", 5), new MenuItem("blue", 7));
    //console.log(orderTest.getTotal());
    let menuArray = [];
    const list = $('#list');
    const order = new Order();
    const cartElem = $('#cartIcon');

    fetch("menu.json")
        .then((r)=>{{
            if(!r.ok){
                throw new Error(r. status);
            }
            return r.json();
        }})
        .then((menuJson)=>{
            menuJson.forEach(item => {
                menuArray.push(new MenuItem(item.name, item.price, item.imageSrc));
            });
            console.log(menuArray);

            menuArray.forEach((item)=>{
                $(`<li class="menuItem"><div><img src="${item.imageSrc}" /><p>${item.name} $${item.price}</p><button class="addButton">Add to Cart</button></div></li>`).appendTo(list)
                    
                    .click((e)=>{
                        e.preventDefault();
                        //console.log(e.target);
                        if(e.target.attributes.class.nodeValue === "addButton"){
                            console.log("button clicked");
                            order.add(item);
                           cartElem.attr("src", "images/cartAdd.png");
                            setTimeout(()=>{cartElem.attr("src", "images/Cart-Icon.png");},1000);
                            console.log(order, order.total);
                        }
                    });
                
            });
           
           
        })
        .catch((e)=>{
            console.error(e);
        });

        

}());