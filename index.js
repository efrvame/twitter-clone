import { tweetsData } from "./data.js"

const tweetInput = document.getElementById("tweet-input")
const tweetBtn = document.getElementById("tweet-btn")

tweetBtn.addEventListener("click", function(){
    console.log(tweetInput.value)
})

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
})

function handleLikeClick(tweetId){
    
    const targetTweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(!targetTweetObject.isLiked){
        targetTweetObject.likes++
        targetTweetObject.isLiked = true
    }else{
        targetTweetObject.likes--
        targetTweetObject.isLiked = false
    }

    render()
}

function getFeedHtml() {
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        let tweetLikes = tweet.likes>0 ? tweet.likes : ''
        let tweetReplies = tweet.replies.length>0 ? tweet.replies.length : ''
        let tweetRetweets = tweet.retweets>0 ? tweet.retweets : ''

        feedHtml += `
        <div class="tweet container">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail blue" data-reply="${tweet.uuid}">
                            <i class="fa-regular fa-comment" data-reply="${tweet.uuid}"></i>
                            ${tweetReplies}
                        </span>
                        <span class="tweet-detail green" data-retweet="${tweet.uuid}">
                            <i class="fa-solid fa-retweet" data-retweet="${tweet.uuid}"></i>
                            ${tweetRetweets}
                        </span>
                        <span class="tweet-detail red" data-like="${tweet.uuid}">
                            <i class="fa-regular fa-heart" data-like="${tweet.uuid}"></i>
                            ${tweetLikes}
                        </span>
                        <span class="tweet-detail blue">
                            <i class="fa-solid fa-chart-simple"></i>
                        </span>
                        <span class="tweet-detail blue">
                            <i class="fa-solid fa-arrow-up-from-bracket"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        `
    })

    return feedHtml
}

function render() {
    document.getElementById("feed").innerHTML = getFeedHtml()
}

render()