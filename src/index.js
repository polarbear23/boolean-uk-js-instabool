// write your code here
/*<!-- This is the Post card. Ust the following HTML as reference to build your cards using JS -->

<article class="image-card">
  <h2 class="title">Title of image goes here</h2>
  <img src="./assets/image-placeholder.jpg" class="image" />
  <div class="likes-section">
    <span class="likes">0 likes</span>
    <button class="like-button">♥</button>
  </div>
  <ul class="comments">
    <li>Get rid of these comments</li>
    <li>And replace them with the real ones</li>
    <li>From the server</li>
  </ul>
  <form class="comment-form">
    <input
      class="comment-input"
      type="text"
      name="comment"
      placeholder="Add a comment..."
    />
    <button class="comment-button" type="submit">Post</button>
  </form>
</article>*/


function createCards(){
    const cardContainer = document.querySelector(".image-container");
    //cardContainer.innerHTML = "";
    fetch("http://localhost:3000/images")
    .then((response) => {
        return response.json();
    })
    .then((images) => {
        console.log(images);
        for(let i = 0; i < images.length; i++){
            const imageCard = document.createElement("article");
            const commentsContainer = document.createElement("ul");
            imageCard.setAttribute("class","image-card");
            const title = document.createElement("h2");
            title.setAttribute("class", "title");
            const img = document.createElement("img");
            img.src = images[i].image;
            img.setAttribute("class", "image");
            imageCard.append(title, img);
            imageCard.appendChild(createLikesSection(images[i]));
            fetch("http://localhost:3000/comments")
            .then(response => {
                return response.json()})
            .then(comments => {
                for(let j = 0; j < comments.length; j++){
                    if(images[i].id === comments[j].imageId){
                        const commentEl = document.createElement("li");
                        const deleteBtn = document.createElement("button");
                        deleteBtn.innerText = "Delete";
                        deleteBtn.addEventListener("click", (e) => {
                            fetch(`http://localhost:3000/comments/${comments[j].id}`, {
                                method: "DELETE",
                            })
                            .then(()=>{
                                removeElements();
                                createCards();
                            })
                        });
                        commentEl.innerText = comments[j].content;
                        commentsContainer.append(commentEl,deleteBtn);
                    }
                }
                imageCard.appendChild(commentsContainer);
                imageCard.appendChild(createCommentForm(images[i]))
            })       
            cardContainer.appendChild(imageCard);
        }
    }
    )
}

function removeElements(){
    const cards = document.querySelectorAll(".image-card");
    for(let i = 1; i < cards.length; i++){
        cards[i].remove();
    }
}

function createLikesSection(image){
    const likesSection = document.createElement("div");
    const likes = document.createElement("span");
    likes.setAttribute("class","likes");
    likes.innerText = `${image.likes} likes`;
    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "like-button");
    likeButton.style.backgroundImage = "url(/assets/like.svg)";
    likeButton.style.backgroundRepeat = "no-repeat";
    likeButton.style.height = "20px";
    likeButton.style.width = "30px";

    likeButton.addEventListener("click", (e)=>{
        fetch(`http://localhost:3000/images/${image.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                likes: image.likes + 1
            })
        })
        .then(()=>{
            removeElements();
            createCards();
        });
    });

    likesSection.append(likes,likeButton);
    return likesSection;
}

function createCommentForm(imageObject){
    const commentForm = document.createElement("form");
    const commentInput = document.createElement("input");
    const commentButton = document.createElement("button");
    commentInput.setAttribute("class","comment-input");
    commentInput.setAttribute("type","text");
    commentInput.setAttribute("name","comment");
    commentInput.setAttribute("placeholder","Add a comment...");
    commentButton.setAttribute("class","comment-button");
    commentButton.setAttribute("type","submit");
    commentButton.innerText = "Post";
    commentForm.append(commentInput,commentButton);
    commentForm.addEventListener("submit", (form)=>{
        form.preventDefault();
        const input = commentForm.querySelector("input");
        const comment = {
            "imageId": imageObject.id,
            "content": input.value,
        }
        fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        })
        .then(()=>{
            removeElements();
            createCards();
        });
    });
    return commentForm;
}
createCards();

/* experiment with jason
const cardInfo = fetch("http://localhost:3000/images")
.then((response) => {
    return response.json();
})
.then((images) => {
    let comments = 
    fetch("http://localhost:3000/comments")
    .then(response =>{
        return response.json();
    }).then(commentsArr =>{
        console.log([images,commentsArr]);
        return [images,commentsArr]
    })
    return comments;
})
console.log(cardInfo);
createCards(cardInfo[0],cardInfo[1]);
*/

function addEventToForm(){
    const form = document.querySelector(".comment-form");
    form.addEventListener("submit", () =>{
        const inputs = form.querySelectorAll("input");
        const title = inputs[0];
        const imageSrc = inputs[1];
        const image = {
            "title": title,
            "image": imageSrc,
            "likes": 0
        }
        fetch("http://localhost:3000/images", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(image)
        })    
    });
}

addEventToForm();