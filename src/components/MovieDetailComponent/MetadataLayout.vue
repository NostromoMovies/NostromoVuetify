<template>
    <div>
    <!-- Movie Title and Redirect Link -->
    <div class="header-section">
        <v-btn class="redirect-btn" color="primary" outlined @click="redirectToDashboard">
         Collection    >
      </v-btn>
      <h1 class="movie-title">Alien</h1>

    </div>
    
    <v-container class="custom-container" fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-card outlined class="movie-poster">
            <!-- <v-img
              src="https://via.placeholder.com/300x450"
              alt="Movie Poster"
              aspect-ratio="2/3"
            ></v-img> -->
          </v-card>
        </v-col>
        
        <!-- Metadata Section -->
        <v-col cols="12" lg="8">
          <v-row>
            <v-col cols="12" md="6" v-for="(metadata, index) in metadataBoxes" :key="index">
              <v-card outlined>
                <v-card-title>{{ metadata.title }}</v-card-title>
                <v-card-text>{{ metadata.content }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
  
     
    
      </v-row>
    </v-container>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        metadataBoxes: [
          { title: "Director", content: "Christopher Nolan" },
          { title: "Genre", content: "Action, Sci-Fi" },
          { title: "Release Year", content: "2023" },
          { title: "Duration", content: "2h 45m" },
        ],
      };
    },
  };
  </script>



 <style scoped>
 .movie-title{
    padding-top: 20px;
 }
 .h{
    padding: 20px;
 }
 .redirect-btn{
    font-size: 10px;
    
 }
 .header-section{
    padding-top: 40px;
    align-content: center;
    text-align: center;
    
 }

 .custom-container {
   
   width: 100%;
   height: 100%;
   margin: 0 auto; 
   padding: 100px; 
 }
 

 .movie-poster {
   background-color: red;
   color:red;
   
 }
 
 .v-img {
   opacity: 0.5;
   max-height: 600px; 
 }
 </style>

