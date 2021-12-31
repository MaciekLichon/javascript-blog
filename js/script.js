'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  tagAuthorColumnLink: Handlebars.compile(document.querySelector('#template-author-column-link').innerHTML)
};

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('1. link was clicked!');
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  console.log('2. all active classes removed');
  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('3. clickedElement', clickedElement);
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  console.log('4. all active articles removed');
  /* get 'href' attribute from the clicked link */
  const clickedAtribute = clickedElement.getAttribute('href'); //articleSelector wg rozwiazania
  console.log('5. clicked atribute =', clickedAtribute);
  /* find the correct article using the selector (value of 'href' attribute) */
  /*
  const matchingArticle = document.getElementById(clickedAtribute.substr(1));
  w linijce wyzej jest rozwiazanie, ktore wymyslilem na poczatku ale faktycznie
  wykorzystanie selectora jest prostrze bo przeciez do id w css odwoluje sie przez #
  */
  const matchingArticle = document.querySelector(clickedAtribute);
  console.log('6. matching article', matchingArticle);
  /* add class 'active' to the correct article */
  matchingArticle.classList.add('active');
  console.log('7. Clicked article displayed');
};

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  authorsListSelector: '.authors.list',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-'
};

function generateTitleLinks(customSelector = ''){
  console.log(customSelector);
  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  console.log('all title links removed');
  /* for each article */
  let html = '';
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  for(let article of articles){
    /* get the article id */
    const articleID = article.getAttribute('id');
    /* find the title element and get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleID + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleID, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
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

/*
function calculateTagsParams(tags){
  let tagValues = [];
  for(let tag in tags) {
    tagValues.push(tags[tag]);
  }
  return {min: Math.min(...tagValues), max: Math.max(...tagValues)};
}
*/

function calculateTagsParams(tags){
  let params = {max: 0, min: 999999};
  for(let tag in tags){
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloudClassCount - 1) + 1 );

  return opts.cloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper (in EACH ARTICLE not DOCUMENT) */
    const tagList = article.querySelector(opts.articleTagsSelector);
    tagList.innerHTML = '';
    console.log(tagList);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      console.log(tag);
      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
      /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    console.log(html);
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  //let allTagsHTML = '';
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //const tagLinkHTML = '<li><a ' + 'class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a> </li>';
    //console.log('tagLinkHTML:', tagLinkHTML);

    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  /* [NEW] END LOOP: for each tag in allTags: */
  }
  console.log('------------------', allTagsData);
  /*[NEW] add HTML from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();


function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('1. tag was clicked!');
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('2. href: ', href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log('3. tag: ', tag);
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log('4. active class tag links: ', activeTagLinks);
  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks){
    /* remove class active */
    /* deselect previously clicked tag links and allow selecting new ones */
    activeTagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  console.log('5. active class removed from all links');
  /* find all tag links with "href" attribute equal to the "href" constant */
  const matchingTags = document.querySelectorAll('a[href="' + href + '"]');
  console.log('6. num of such',tag ,'tags on the website:', matchingTags);
  /* START LOOP: for each found tag link */
  for(let matchingTag of matchingTags) {
    /* add class active */
    /* select all new tag links */
    matchingTag.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  console.log('7. each',tag,'tag link is now active');
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}


function addClickListenersToTags(){
  /* find all links to tags */
  const tags = document.querySelectorAll('.post-tags .list a, .tags.list a');
  /* START LOOP: for each link */
  for(let tag of tags){
    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();


function generateAuthors(){
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find author wrapper (in EACH ARTICLE not DOCUMENT) */
    const author = article.querySelector(opts.articleAuthorSelector);
    author.innerHTML = '';
    /* make html variable with empty string */
    let html = '';
    /* get author from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    console.log(articleAuthor);
    /* generate HTML of the link */
    //const linkHTML = 'by <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    const linkHTMLData = {author: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);
    console.log(linkHTML);
    /* add generated code to html variable */
    html = linkHTML;
    /* insert HTML of all the links into the author wrapper */
    author.innerHTML = html;
    /* Authors counter */
    if(!allAuthors[articleAuthor]){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  /* END LOOP: for every article: */
  }

  /* Generate author links in the right column */
  const authorList = document.querySelector(opts.authorsListSelector);
  authorList.innerHTML = '';

  /*
  let allAuthorsHTML = '';
  for (let author in allAuthors){
    const authorLinkHTML = '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ')</a></li>';
    allAuthorsHTML += authorLinkHTML;
  }
  authorList.innerHTML = allAuthorsHTML;
  */
  const allAuthorData = {authors: []};
  for (let author in allAuthors){
    allAuthorData.authors.push({
      author: author,
      count: allAuthors[author]
    });
  }
  console.log(allAuthorData);
  authorList.innerHTML = templates.tagAuthorColumnLink(allAuthorData);
}

generateAuthors();


function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('1. author was clicked!');
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('2. href: ', href);
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  console.log('3. author: ', author);
  /* find all authors with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log('4. active author links: ', activeAuthorLinks);
  /* START LOOP: for each active author link */
  for(let activeAuthorLink of activeAuthorLinks){
    /* remove class active */
    /* deselect previously clicked author links and allow selecting new ones */
    activeAuthorLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  console.log('5. active class removed from all links');
  /* find all author links with "href" attribute equal to the "href" constant */
  const matchingAuthors = document.querySelectorAll('a[href="' + href + '"]');
  console.log('6. num of such',author ,'tags on the website:', matchingAuthors);
  /* START LOOP: for each found tag link */
  for(let matchingAuthor of matchingAuthors) {
    /* add class active */
    /* select all new tag links */
    matchingAuthor.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  console.log('7. each',author,' link is now active');
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}


function addClickListenersToAuthors() {
  /* find all links to authors */
  const authors = document.querySelectorAll('.post-author a, .authors.list a');
  /* START LOOP: for each link */
  for(let author of authors){
    /* add authorClickHandler as event listener for that link */
    author.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
