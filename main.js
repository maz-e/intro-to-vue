Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            product: 'Socks',
            description: 'A pair of warm, fuzzy socks',
            brand: "Vue Mastery",
            selectedVariant: 0,
            altText: 'A pair of shocks',
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ]
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function(index) {
            this.selectedVariant = index
        },
        deleteFromCart() {
            this.$emit('delete-from-cart', this.variants[this.selectedVariant].variantId)
        }
    },
    computed: {
        title() {
            return `${this.brand} ${this.product}`
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            return this.premium ? 'Free' : 2.99
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{outOfStock: !inStock}">Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
           
            <product-details :details="details"></product-details>
            
            <div v-for="(variant, index) in variants" 
                class="color-box"
                :key="variant.variantId"
                :style="{ backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)"
                >
            </div>
            
            <button v-on:click="addToCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}"
                >Add to cart</button>

            <button @click="deleteFromCart">Delete from cart</button>
        </div>
    </div>
    `
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        deleteCart(id) {
            this.cart = this.cart.filter(elem => elem != id)
        }
    }
})