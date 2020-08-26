const axios = require('axios')
//you have to insert the object, where inside have array of foodId
axios.patch("http://localhost:3030/orders/food/assign/1", {foodId: [4, 2]}).then((result) => {
    console.log(result.data)
})