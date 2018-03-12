def Home(i, j) :
  dd= MaxFld-6+i-j
  if dd <0 : return 1
  if dd==0 and i>0 and j<MaxFld-1 : return 1
  dd = MaxFld-6+j-i
  if  dd <0 :return 0
  if dd==0 and j>0 and i<MaxFld-1 :  return 0
  return -1

def Init() :
  for i in range(MaxFld) :
    for j in range (MaxFld) :
      Fld[i][j]=Home(j, i)

def pprint(matrice):
  for x in matrice :
	for y in x : print y , 
	print "\n"

MaxFld = 16
Fld = [[0]*MaxFld for i in range(MaxFld)]
Init()
pprint(Fld)

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1  0  0  0  0  0 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1  0  0  0  0  0 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1  0  0  0  0 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1  0  0  0 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1  0  0 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

#-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

# 1  1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

# 1  1  1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

# 1  1  1  1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

# 1  1  1  1  1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 

# 1  1  1  1  1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 
