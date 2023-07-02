# TemSensi
The project is an EdgeX project, our project name is TemSensi which stands for temperature sensor.
>Our goal is to make the sensor more than a sensor, to make your life easier! 

## License

[Apache-2.0](LICENSE)

## Testing Environment
* The best is using go 1.20, otherwise make sure you have go version later than go 1.12
> Go Installation
* Windows
Go to golang official website and download the latest go version
```
https://go.dev/dl/
```

Clone this github repository and run the project
```
git clone http://github.com/timxie140/TemSensi
cd TemSensi
make build
```

* Linux
Get the package using the below command
```
wget https://go.dev/dl/go1.20.5.linux-amd64.tar.gz
```
Unzip go
```
sudo tar -xvf go1.20.5.linux-amd64.tar.gz
```
Move go to usr/local directory
```
sudo mv go /usr/local
```
Use the below command and add the following two lines in the file
type "a" to start writing, when done press "esc" and then type ":w" and enter to save file, ":q" and enter to quit
```
vim ~/.profile
```
Use this line to apply setting
```
source ~/.profile
```
At last use this line to check installation
```
go version
```
Should return "go version go1.20.5 linux/amd64"