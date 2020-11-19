/*global $*/
(function(){
    'use strict';

    let ordersPlaced = [];
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
        constructor(customer, ...items){
            this.customer = customer;
            // this.name = name;
            // this.street = street;
            // this.city = city;
            // this.state = state;
            // this.zip = zip;
            // this.phone = phone;
            this.items =items ||[];
        }

        get total(){
            let total = 0;
          this.items.forEach((item)=>{
            total+= item.price;
          });
          return total;
        }
        add(item){
            //this.items = this.items || [];
            this.items.push(item);
            
        }
    }

    class Customer{
        constructor(name, street, city, state, zip, phone, email){
            this.name=name;
            this.street= street;
            this.city= city;
            this.state = state;
            this.zip = zip;
            this.phone = phone;
            this.email = email;
        }
    }

    //const orderTest = new Order(new MenuItem("carrots", 5), new MenuItem("blue", 7));
    //console.log(orderTest.getTotal());
    let menuArray = [];
    const list = $('#list');
    let order = new Order();
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

        cartElem.click(()=>{
            if(order.items.length !== 0){
                updateOrderForm();
                $('#modal').show();
                $('#form').show();
            }
        });

        $('#order').click(()=>{
            //Theoretically would do order submission and have an order confirmation
            let inputs = $('input');
            let inputValues = getFields(inputs, "value");
            let [name, street, city, state, zip, phone, email] = inputValues;
            order.customer = new Customer(name, street, city, state, zip, phone, email);
        
            console.log(order);
            $('#modal').hide();
            $('#form').hide();
           // $('#form').empty();
           
            ordersPlaced.push(new Order(order.customer, ...order.items));
            console.log(ordersPlaced);

           order.items =[];
           order.customer = [];
           emptyFields();

        });
        function getFields(input, field) {
            var output = [];
            for (var i=0; i < input.length ; ++i){
                output.push(input[i][field]);
            }
            return output;
        }
        function emptyFields() {
            $('#name').val('');
            $('#street').val('');
            $('#city').val('');
            $('#state').val('');
            $('#zip').val('');
            $('#phone').val('');
            $('#email').val('');
        }

        $('#cancel').click(()=>{
            $('#modal').hide();
            $('#form').hide();
        });

        function updateOrderForm(){
            const tableElem = $("#orderTable");
            tableElem.empty();
            tableElem.append(`<tr id="head">   
            <td id ="imgColumn"></td>
            <td>Item</td>
            <td>Price</td>
         </tr>`);
            order.items.forEach((item)=>{
                let price = item.price.toFixed(2);
                tableElem.append(`<tr>
                    <td><img src ="${item.imageSrc}"/></td>
                    <td>${item.name}</td>
                    <td class="price">$${price}</td>
                    </tr>`);
            });
            tableElem.append(
                `<tr>
                    <td colspan="2" style="text-align: right">Order Total:</td>
                    <td class="price">$${order.total.toFixed(2)}</td>
                </tr>`
            );
        }
        

}());