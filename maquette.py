#! /usr/bin/env python
# -*- coding: utf-8 -*-
# script morpion
# Chelighem Assia

from Tkinter import * 
from random import randrange
import pygame

 

class Dames :
  
    def __init__(self, top):
      self.top = top
      self.X = 17; self.Y = 25                                       # rows and columns
      self.J = False                                                 #pour désigner le joueur symbolique  
      self.IsOver = False
      self.Dic = {-1: "light grey", 1: "green", 2: "yellow", 3: "red", 4: "blue", 5: "pink", 6: "purple"} 
      self.Start = (0,0)                                             # case départ pour un mouvement     
      self.Tree = {} 
      self.liste=[]                                          
      self.M = [self.Y * [False] for x in range(self.X)]             # toutes cellules initialement libres
      self.ID = [self.Y * [None] for x in range(self.X)]             # matrice pour interner chaque canvas dans une case 
      self.score_liste =[0, 0]                                       # score initile égale à zero
      self.score = Label(top, text = 'score: \n  green = %s - yellow= %s' % (self.score_liste[0], self.score_liste[1]))
      self.score.pack()
      self.grille = Frame(top)
      self.init_matrice()
      for R in range(self.X) :
        for C in range(self.Y): 
          if (self.M[R][C]): self.create_canevas(R, C, self.M[R][C])
      self.grille.pack()
      self.stop = Button(top, text='Quiter', command = top.destroy)              # un bouton pour arreter ce jeu idiot 
      self.stop.pack(side= 'right', padx =5)
      self.relance = Button(top, text='Recommencer', command = self.recommencer) # un bouton pour recommencer ce jeu fascinant  
      self.relance.pack(side = 'left', padx = 5)
      self.info = Label(top)
      self.info.pack()
      pygame.mixer.init(44100)


    def init_matrice(self) :
      for R in range(4) : 
        for C in range(12-R, 12+R+1, 2) : 
          self.M[R][C] = 1
          self.M[16-R][C] = 2  
      for R in range(4, 8) : 
        for C in range(12-R, 12+R+1, 2) : 
          self.M[R][C] = -1  
          self.M[16-R][C] = -1  
        for C in range(R-4, 10-R+1, 2) : 
          self.M[R][C] = 3  
          self.M[16-R][C]=4
          self.M[R][24-C]=5 
          self.M[16-R][24-C] =6
      for C in range(4, 21, 2) :  self.M[8][C] = -1  
  

    def create_canevas(self, R, C, option=0) :
      self.ID[R][C] = Canvas(self.grille, width = 25, height = 30) #identité de chaque canvas dans la matrice ID
      self.ID[R][C].bind("<Button-1>", self.joue)                            
      self.ID[R][C].grid(row = R, column = C)                    
      self.ID[R][C].R , self.ID[R][C].C = R, C                               # localisation de chaque cellule ligne et colonne
      self.fais_pion(self.ID[R][C], self.Dic[option])
    
    def recommencer(self):
      self.init_matrice()
      self.init_toile()
      self.J=False    # rétablir le joueur initiale
                                                 
    def init_toile(self): 
      for R in range(self.X) :
        for C in range(self.Y): 
          if (self.M[R][C]):
            self.ID[R][C].delete(ALL)                                            # effacer tout 
            self.fais_pion(self.ID[R][C], self.Dic[self.M[R][C]])

    def joue(self, event):                                            # handler lié à <Button-1> 
      if self.IsOver :return                            
      self.valide_movement(event) 

    def valide_movement(self, event) :                                   
      w = event.widget 
      if self.Start == (0,0) :                                        # premier click
        if self.M[w.R][w.C] != self.J+1 : return                      # vérifie qu'on click sur le pion du joueur qui a la main
        self.Start = (w.R, w.C)
        w.create_oval(3, 3, 25, 25, fill = self.Dic[self.J+1], width = 3)
        self.get_traject(w.R, w.C)
        self.M[w.R][w.C] = -1
      else :
        if (w.R, w.C) == self.Start :                                  # retour à la case départ anulle le mouvement
          self.M[w.R][w.C] = self.J+1        
          self.Start = (0,0)
          w.delete(ALL)
          w.create_oval(3, 3, 25, 25, fill = self.Dic[self.J+1])
          self.Tree = {}
        if self.M[w.R][w.C] != -1 : return                            # case non vide
        if (w.R, w.C) not in self.Tree : 
          self.info.config(fg="red")
          self.info['text']= 'chemin invalide pour le joueur %s'  % self.Dic[self.J+1]  
          pygame.mixer.music.load("fail.mp3")
          pygame.mixer.music.play()            
          return                              
        traject = self.Tree[(w.R, w.C)]
        self.make_move(traject)

    def fais_pion(self, w, color, largeur=1) :
      w.create_oval(3, 3, 25, 25, fill = color, width=largeur)
    

    def get_traject(self, R, C) :
      for i in range(R-1, R+2) :                # premier  mouvement adjaçant
        for j in range (C-2, C+3) :
          if (i!=R or j!=C) and self.in_etoile(i,j) and self.M[i][j]== -1 :
            self.Tree[(i,j)] =  [(R,C) ,(i,j)]
      self.get_hope(R,C) 
      while (self.liste) :
        new= self.liste.pop(0)
        if new != self.Start :
          self.get_hope(new[0], new[1], self.Tree[new])


    def get_hope(self, R, C, parent=0) :
      if  not parent : parent = [(R,C)]
    #chercher saut sur ligne 2 directions:
      for j in (-2, 2) :                        # avancer de deux pas sur la ligne
        pivot_c = C+j
        while self.in_etoile(R, pivot_c) and self.M[R][pivot_c] == -1 :            # avancer jusqu'a case occupée
          pivot_c += j
        n=0
        for k in range(pivot_c+j, 2*pivot_c-C+1, j) :
          if not self.in_etoile(R, k) : break
          if self.M[R][k] != -1 : n+=1         # si un autre pion sur le chemin break
        if (n==0) :
          index = 2*pivot_c-C 
          if (R, index) in self.Tree : continue                     # éviter de tourner rond
          if self.in_etoile(R, index) and self.M[R][index]== -1 :   # si la case en asymétrie est vide valide:  
            traject = parent + [(R, index)] 
            self.Tree[(R,index)] = traject
            self.liste.append((R, index))
    #chercher saut sur diagonal 4 directions :
      for i in (-1, 1) :                        # avancer d'un seul pas sur le diagonal
        for j in (-1, 1) :
          pivot_r = R+i
          pivot_c = C+j
          while self.in_etoile(pivot_r, pivot_c) and self.M[pivot_r][pivot_c] == -1 :            # avancer jusqu'a case occupée
            pivot_r += i
            pivot_c += j
          n=0
          for k in range(1, j * (pivot_c-C)+1,):
            if not self.in_etoile(pivot_r+i*k, pivot_c+j*k) : break
            if self.M[pivot_r+i*k][pivot_c+j*k] != -1 : n+=1         # si un autre pion sur le chemin break
          if (n==0) :
            index_r = 2*pivot_r-R
            index_c = 2*pivot_c-C
            if (index_r, index_c) in self.Tree : continue                     # éviter de tourner rond
            if self.in_etoile(index_r, index_c) and self.M[index_r][index_c]== -1 :   # si la case en asymétrie est vide valide: 
                print "case access (%i, %i) avec comme pivot (%i, %i)" % (index_r, index_c, pivot_r, pivot_c)     
                traject = parent + [(index_r, index_c)] 
                self.Tree[(index_r,index_c)] = traject
                self.liste.append((index_r, index_c))

    

    def make_move(self, mov_list):
        previous = mov_list[0]
        try : 
          actuel = mov_list[1]
          self.M[previous[0]][previous[1]] = -1
          self.M[actuel[0]][actuel[1]] = self.J+1
          self.ID[previous[0]][previous[1]].delete(ALL)                                            # effacer tout 
          self.fais_pion(self.ID[previous[0]][previous[1]], self.Dic[-1])
          self.fais_pion(self.ID[actuel[0]][actuel[1]], self.Dic[self.J+1], 2)
          pygame.mixer.music.load("click.mp3")
          pygame.mixer.music.play()
          self.top.after(500, self.make_move, mov_list[1:])
        except IndexError :
          self.ID[previous[0]][previous[1]].delete(ALL)                                            # effacer tout 
          self.fais_pion(self.ID[previous[0]][previous[1]], self.Dic[self.J+1]) 
          self.Start = (0,0)
          self.Tree = {}
          self.info['text']= ''
          if self.gagnant(self.J+1) :
            self.score_liste[self.J] +=1
            self.score['text'] = 'score: \n  green = %s - yellow= %s' % (self.score_liste[0], self.score_liste[1]) #afficher ce score
            self.info['text']= 'Bravo!, le jouer %s a gagné'  % self.Dic[self.J+1]                             # le filiciter
            self.IsOver = True
          self.J = not self.J

        


    def in_etoile(self, x,y) :
     return -1<x<17 and -1<y<25

    def gagnant(self, s) :
      for R in range(4) : 
        for C in range(12-R, 12+R+1, 2) : 
          if s == 1 : 
            if self.M[16-R][C] != 1 : return False      
          elif s ==2 :
            if self.M[R][C] != 2: return False
      return True
            
if __name__ == '__main__':
  fenetre = Tk()                                 
  fenetre.title('Dames Chinoises')
  prog= Dames(fenetre)                          
  fenetre.mainloop()
