const eventBus = new Vue()

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
            ],
            reviews: []
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
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
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
            
            <product-info :shipping="shipping" :details="details"></product-info>
            
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

        <product-tabs :reviews="reviews"></product-tabs>
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

Vue.component('product-reviews', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
    <div>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>Recommend the product? {{ review.recommend }}</p>
          <p>{{ review.review }}</p>
          </li>
        </ul>
    </div>
    `
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <product-review-errors :errors="errors"></product-review-errors>
    
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="Your name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review" placeholder="Write a review!"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p class="inputRadio">
        <label for="recommend">Would you recommend this product?</label><br>
        <input type="radio" v-model="recommend" name="recommend" value="yes"> Yes<br>
        <input type="radio" v-model="recommend" name="recommend" value="no"> No
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null,
                this.review = null,
                this.rating = null,
                this.recommend = null,
                this.errors = []
            } else {
                this.errors = []
                if (!this.name) this.errors.push('Name required.')
                if (!this.review) this.errors.push('Review required.')
                if (!this.rating) this.errors.push('Rating required.')
                if (!this.recommend) this.errors.push('Recommendation required.')
            }
        }
    }
})

Vue.component('product-review-errors', {
    props: {
        errors: {
            type: Array,
            required: false
        }
    },
    template: `
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
    `
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
    <div>
        <div>
            <span class="tab" :class="{ activeTab: selectedTab === tab }" 
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab">
                {{ tab }}
            </span>
        </div>

        <div v-show="selectedTab === 'Reviews'">
            <product-reviews :reviews="reviews"></product-reviews>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('product-info', {
    props: {
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <div>
            <span class="tab" :class="{ activeTab: selectedTab === tab }" 
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab">
                {{ tab }}
            </span>
        </div>

        <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }}</p>
        </div>
        <div v-show="selectedTab === 'Details'">
            <product-details :details="details"></product-details>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }
})

const app = new Vue({
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