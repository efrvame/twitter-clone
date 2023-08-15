import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

/* localStorage.setItem("myTweets", JSON.stringify(tweetsData)) */

let localTweets

if(localStorage.getItem("myTweets")){
    localTweets = JSON.parse(localStorage.getItem("myTweets"))    
} else {
    localTweets = tweetsData
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    } 
    else if (e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
    else if (e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
})

function handleLikeClick(tweetId){
    
    const targetTweetObject = getTweetObject(tweetId)

    if(!targetTweetObject.isLiked){
        targetTweetObject.likes++
    }else{
        targetTweetObject.likes--
    }
    
    targetTweetObject.isLiked = !targetTweetObject.isLiked

    render()
}

function handleRetweetClick(tweetId){

    const targetTweetObject = getTweetObject(tweetId)

    if(targetTweetObject.isRetweeted){
        targetTweetObject.retweets--
    } else {
        targetTweetObject.retweets++
    }

    targetTweetObject.isRetweeted = !targetTweetObject.isRetweeted
    render()
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    
    let targetTweetObject = getTweetObject(replyId)

    targetTweetObject.repliesHidden = !targetTweetObject.repliesHidden
    render()
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById("tweet-input")

    if(tweetInput.value!=''){
        localTweets.unshift({
            handle: `@efrvame`,
            profilePic: `images/avatar.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            repliesHidden: true,
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        })

        render()
        tweetInput.value = ''
    }
}

function handleReplyBtnClick(replyId){
    let replyInput = document.getElementById(`modal-input-${replyId}`)
    
    if(replyInput.value){
        let targetTweetObject = getTweetObject(replyId)

        targetTweetObject.replies.unshift(
            {
                handle: `@efrvame`,
                profilePic: `images/avatar.jpg`,
                tweetText: replyInput.value,
            }
        )
        
        targetTweetObject.repliesHidden = false
        render()
        replyInput.value = ''
    }
}

function handleDeleteClick(tweetId){
    
    let tweetIndex = localTweets.findIndex(function(tweet){
        return tweet.uuid === tweetId
    })

    localTweets.splice(tweetIndex, 1)
    render()
}

function getTweetObject(uuid){
    return localTweets.filter(function(tweet){
        return tweet.uuid === uuid
    })[0]
}

function getFeedHtml() {
    let feedHtml = ``
    
    localTweets.forEach(function(tweet){
        let tweetLikes = tweet.likes>0 ? tweet.likes : ''
        let tweetReplies = tweet.replies.length>0 ? tweet.replies.length : ''
        let tweetRetweets = tweet.retweets>0 ? tweet.retweets : ''

        let likeIconClass = tweet.isLiked ? 'liked' : ''
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''
        let heartIconClass = tweet.isLiked ? 'fa-solid' : 'fa-regular'
        
        let repliesHiddenClass = tweet.repliesHidden ? "hidden" : ""
        let repliesHtml = ''
    
        if (tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
                <div class="tweet-reply container">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }

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
                        <span class="tweet-detail green ${retweetIconClass}" data-retweet="${tweet.uuid}">
                            <i class="fa-solid fa-retweet" data-retweet="${tweet.uuid}"></i>
                            ${tweetRetweets}
                        </span>
                        <span class="tweet-detail red ${likeIconClass}" data-like="${tweet.uuid}">
                            <i class="${heartIconClass} fa-heart" data-like="${tweet.uuid}"></i>
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
            <i 
                class="fa-solid fa-xmark blue delete-tweet"
                data-delete="${tweet.uuid}"
                ></i>
        </div>
        <div class="${repliesHiddenClass}" id="replies-${tweet.uuid}">
            <div class="container reply-container col-flex">
                <div class="tweet-input-area">
                    <img src="images/avatar.jpg" class="profile-pic">
                    <textarea placeholder="Post your reply!" id="modal-input-${tweet.uuid}"></textarea>
                </div>
                <button
                    id="reply-btn-${tweet.uuid}"
                    data-reply-btn="${tweet.uuid}"
                    >
                    Reply
                </button>
            </div>
            ${repliesHtml}
        </div>
        `
    })

    return feedHtml
}

function render() {
    document.getElementById("feed").innerHTML = getFeedHtml()
    localStorage.setItem("myTweets", JSON.stringify(localTweets))
}

render()