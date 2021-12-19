'use strict';

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('link was clicked!');

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  console.log('all active classes removed');

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement', clickedElement);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  console.log('all active articles removed');

  /* get 'href' attribute from the clicked link */
  const clickedAtribute = clickedElement.getAttribute('href'); //articleSelector wg rozwiazania
  console.log('clicked atribute =', clickedAtribute);

  /* find the correct article using the selector (value of 'href' attribute) */
  /*
  const matchingArticle = document.getElementById(clickedAtribute.substr(1));
  w linijce wyzej jest rozwiazanie, ktore wymyslilem na poczatku ale faktycznie
  wykorzystanie selectora jest prostrze bo przeciez do id w css odwoluje sie przez #
  */
  const matchingArticle = document.querySelector(clickedAtribute);
  console.log('matching article', matchingArticle);

  /* add class 'active' to the correct article */
  matchingArticle.classList.add('active');
  console.log('Clicked article displayed');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks(){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  console.log('all title links removed');

  /* for each article */
  let html = '';

  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){

    /* get the article id */
    const articleID = article.getAttribute('id');

    /* find the title element and get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleID + '"><span>' + articleTitle + '</span></a></li>';
    console.log('id', articleID, 'title', articleTitle, 'link created');

    /* insert link into titleList */
    /* titleList.insertAdjacentHTML('beforeend', linkHTML); */
    html = html + linkHTML;
  }
  console.log('all created links', html);

  titleList.innerHTML = html;
  console.log('links added in HTML', titleList);

  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
  console.log('all links have click handler assigned', links);
}

generateTitleLinks();
