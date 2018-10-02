//VARIABLES
const jobQueryForm = document.getElementById("jobQueryForm");
const jobQueryInput = document.getElementById("jobQueryInput");
const jobBtnSubmit = document.getElementById("jobBtnSubmit");
const jobFeed = document.getElementById('jobFeed');
const output = document.getElementById("output");
const left = document.getElementById('left');
const right = document.getElementById('right');
const parent = document.getElementById("parent");

//Initial state
jobFeed.innerHTML= 'Searching...';
document.getElementById('loading').style.display = 'block';
left.style.display = 'none';
right.style.display = 'none';
parent.style.height = '100vh';

//===============================================EVENTLISTENER for SEARCH JOBS=====================================//
jobQueryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let job = jobQueryInput.value;

  parent.style.height = '100vh';
  
  //Show Loader
  document.getElementById('loading').style.display = 'block';

  //GET JOBS
  getJobs(job);
  
  //Clear Fields
  clearFields();

  //Reset SearchResult when new search is established
  document.getElementById("output").innerHTML = '';

  jobFeed.innerHTML= 'Searching...';

  left.style.display = 'none';
  right.style.display = 'none';
  
  //ADD recent seraches
  recentSearches(job);
  
});

//===============================================EVENTLISTENER for DEFAULT JOBS=====================================//
document.addEventListener('DOMContentLoaded', defaultJobs);
function defaultJobs() {
  axios.get(`https://jobs.github.com/positions.json?description=`)
  .then(response => {
    parent.style.height = 'auto';
    jobFeed.innerHTML = 'Hot Jobs';
    showTenJobs(response);
    featuredCompanies(response);
  })
  .catch(err => console.log(err));
}


//GET JOBS
function getJobs(job) {
  axios.get(`https://jobs.github.com/positions.json?description=${job}`)
    .then(response => {
      parent.style.height = 'auto';
      jobFeed.innerHTML= `All related "${job}" jobs `;
      showJobs(response);
      featuredCompanies(response);
    })
    .catch(err => console.log(err));
}

//SHOW SEARCH JOBS
function showJobs(response) {
      let jobResults = response.data;
      let jobOutput = "";

      //HideLoader and Sidebars
      document.getElementById('loading').style.display = 'none';
      left.style.display = 'block';
      right.style.display = 'block';

      //VALIDATION TO CHECK IF JOB EXISTS
      if(jobResults.length === 0) {
        jobOutput = `
                        <h1 class="text-center pt-5">Oops! The job that you are looking for does not exist!</h2>
                        <br>
                        <img src="img/JRSTIux_transparent.png" class="img-fluid d-block mx-auto pb-5">
                    `;
      
        jobFeed.innerHTML= '';
        left.style.display = 'none';
        right.style.display = 'none';
        
      } else {

      jobResults.forEach(function (jobResult) {
        //check if company logo is available
        let image = jobResult.company_logo ? jobResult.company_logo : "img/githubjobs.png";

        //TRUNCATE TEXT
        let description = jobResult.description;
        let desLength = description.length;
        let id = jobResult.id
        
        if(desLength >= 150) {
          description = description.substring(0,150);
          description = description.replace(/\w+$/, '');
          description += `<a href="#" class="showText text-info" id=${id}>...Show More</a>`;
        }
        
        //CLICK SHOW MORE
       
        if(parent) {
          parent.addEventListener('click', function(e) {
            e.preventDefault();
              if(e.target.classList[0] === 'showText' && e.target.id === id) {
               
                e.target.parentNode.innerHTML = `${jobResult.description} <a href="#" class="hideText text-info" id=${id}>...Show Less</a>`;
              }  
          })
          // CLICK SHOW LESS
          parent.addEventListener('click', function(e) {
            e.preventDefault();
            if(e.target.classList[0] === 'hideText' && e.target.id === id) {
              e.target.parentNode.innerHTML = `${description}`;
            }
          })
  
        }
        
        // CHECK IF CONTRACT OR FULLTIME
        let jobType = jobResult.type === 'Contract' ? `<span class="badge badge-warning text-center" style="padding: 0.75em 1.5em; font-size: 12px!important">${jobResult.type}</span>` : `<span class="badge badge-success text-center" style="padding: 0.75em 1.5em; font-size: 12px!important">${jobResult.type}</span>`;
        
        // OUTPUT TO DOM
        jobOutput += `
                        <div class="card my-3">
                          <div class="card-header">
                            <h5 class="d-inline font-weight-bold" style="color:#2B7FC3!important">${jobResult.title}</h5>

                            <div class="d-inline float-right">
                              <span class="thumb"><i class="far fa-thumbs-up" style="cursor:pointer"></i></span>
                              <span class="bookmark"><i class="far fa-bookmark"  style="cursor:pointer"></i></span>
                            </div>
                          </div>
                          <div class="card-body">
                            <div class="row">
                              <div class="col-md-4">
                                <img src="${image}" height="130" width="100%" class="d-block mx-auto">
                              </div>
                              <div class="col-md-8">
                                <h6 class="card-text font-weight-bold">${jobResult.company}</h6>
                                <p><i class="fas fa-map-marker-alt" style="color:#5bc0de"></i> ${jobResult.location}</p>
                                <small></small>
                                ${jobType}
                                <p style="font-style: normal!important;">${description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        `;
      });
    }
    output.innerHTML = jobOutput;
    bookMarker();
}

//Featured Companies
function featuredCompanies(response) {
  let jobResults = response.data;
  let companies = jobResults.slice(0,2);
  let companyOutput = '';
  console.log(companies)
  companies.forEach(function(company) {
    companyOutput += `<div class="outer mb-2">
                        <img class="inner" src="${company.company_logo}" height="120" width="100%">
                      </div>`
  })
  document.getElementById('featured').innerHTML = companyOutput;
}


//LIMIT TO 10 JOBS
function showTenJobs(response) {
  let jobResults = response.data;
  let tenJobResults = jobResults.slice(0 , 10);
  let jobOutput = "";

  //HideLoader and Sidebars
  document.getElementById('loading').style.display = 'none';
  left.style.display = 'block';
  right.style.display = 'block';

  //VALIDATION TO CHECK IF JOB EXISTS
  if(tenJobResults.length === 0) {
    jobOutput = `
                    <h1 class="text-center pt-5">Oops! The job that you are looking for does not exist!</h2>
                    <br>
                    <img src="img/JRSTIux_transparent.png" class="img-fluid d-block mx-auto pb-5">
                `;
  
    jobFeed.innerHTML= '';
    left.style.display = 'none';
    right.style.display = 'none';
    
  } else {

    tenJobResults.forEach(function (jobResult) {
    //check if company logo is available
    let image = jobResult.company_logo ? jobResult.company_logo : "img/githubjobs.png";

    //TRUNCATE TEXT
    let description = jobResult.description;
    let desLength = description.length;
    let id = jobResult.id
    
    if(desLength >= 150) {
      description = description.substring(0,150);
      description = description.replace(/\w+$/, '');
      description += `<a href="#" class="showText text-info" id=${id}>...Show More</a>`;
    }
    
    //CLICK SHOW MORE
    
    if(parent) {
      parent.addEventListener('click', function(e) {
        e.preventDefault();
          if(e.target.classList[0] === 'showText' && e.target.id === id) {
           
            e.target.parentNode.innerHTML = `${jobResult.description} <a href="#" class="hideText text-info" id=${id}>...Show Less</a>`;
          }  
      })
      // CLICK SHOW LESS
      parent.addEventListener('click', function(e) {
        e.preventDefault();
        if(e.target.classList[0] === 'hideText' && e.target.id === id) {
          e.target.parentNode.innerHTML = `${description}`;
        }
      })

    }

    // CHECK IF CONTRACT OR FULLTIME
    let jobType = jobResult.type === 'Contract' ? `<span class="badge badge-warning text-center" style="padding: 0.75em 1.5em; font-size: 12px!important">${jobResult.type}</span>` : `<span class="badge badge-success text-center" style="padding: 0.75em 1.5em; font-size: 12px!important">${jobResult.type}</span>`;
    
    // OUTPUT TO DOM
        jobOutput += `
                        <div class="card my-3">
                          <div class="card-header">
                            <h5 class="d-inline font-weight-bold">${jobResult.title}</h5>

                            <div class="d-inline float-right">
                              <span class="thumb"><i class="far fa-thumbs-up" style="cursor:pointer"></i></span>
                              <span class="bookmark"><i class="far fa-bookmark"  style="cursor:pointer"></i></span>
                            </div>
                          </div>
                          <div class="card-body">
                            <div class="row">
                              <div class="col-md-4">
                                <img src="${image}" height="130" width="100%" class="d-block mx-auto">
                              </div>
                              <div class="col-md-8">
                                <h6 class="card-text font-weight-bold">${jobResult.company}</h6>
                                <p><i class="fas fa-map-marker-alt" style="color:#5bc0de"></i> ${jobResult.location}</p>
                                <small></small>
                                ${jobType}
                                <p style="font-style: normal!important;">${description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        `;
  });
}
  output.innerHTML = jobOutput;
  bookMarker();
   
}


//CLEAR FIELDS
function clearFields() {
  document.getElementById("jobQueryInput").value = '';
}


// RECENT SEARCHES
let recent = '';
function recentSearches(job) {
  //console.log(job)
  recent += `<div class="d-flex">
                <div class="mr-auto"><p>${job}</p></div>
            </div>`;
  document.getElementById('recent').innerHTML = recent;
}

// SAVED JOBS
function saveJob(marker) {
let jobTitle = marker.parentNode.parentNode.children[0].textContent; 
document.getElementById('savedJobs').innerHTML += `<li class="saved list-group-item p-2" style="cursor:pointer">${jobTitle}</li>`;
  
}

//REMOVE JOBS
function removeJob(marker) {
  let jobTitle = marker.parentNode.parentNode.children[0].textContent; 
  let parent = document.getElementById('savedJobs');
  let saved = document.querySelectorAll('.saved');
  for(let i = 0; i < saved.length; i++) {
    if(parent.children[i] === saved[i] && saved[i].textContent === jobTitle) {
      parent.children[i].remove()
    }
  } 
}

function bookMarker() {
//THUMB LIKE
      let thumb = document.querySelectorAll(".thumb");
      if (thumb) {
        thumb.forEach(function (thmb) {
          thmb.addEventListener("click", function (e) {
            // e.preventDefault();

            //TOGGLE LIKE and UNLIKE
            let like = e.target.parentNode;
            if (like.innerHTML === '<i class="far fa-thumbs-up" style="cursor:pointer"></i>') {
              like.innerHTML = '<i class="fas fa-thumbs-up" style="cursor:pointer"></i>';
              
             
            } else {
              like.innerHTML = '<i class="far fa-thumbs-up" style="cursor:pointer"></i>';
              
            }
            // console.log(like);
          });
        });
      }

      //HEART/BOOKMARK
      let bookmark = document.querySelectorAll(".bookmark");
      if (bookmark) {
        bookmark.forEach(function (bkmrk) {
          bkmrk.addEventListener("click", function (e) {
            e.preventDefault();

            //TOGGLE Bookmark
            let marker = e.target.parentNode;
            if (marker.innerHTML === '<i class="far fa-bookmark" style="cursor:pointer"></i>') {
              marker.innerHTML = '<i class="fas fa-bookmark" style="cursor:pointer"></i>';
              saveJob(marker);
           
            } else {
              marker.innerHTML = '<i class="far fa-bookmark" style="cursor:pointer"></i>';
              removeJob(marker);
            }
          });
        });
    }  
  }