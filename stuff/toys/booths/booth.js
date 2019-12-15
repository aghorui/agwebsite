// Public Domain
var tablehead = "<th>n</th><th>M</th><th>A</th><th>Q</th><th>Remark</th>"

function dectobin(n, t) // n = number, t = truncate upto
{
	var i = 0, k = 0, e = 1;
	
	while(n > 0)
	{
		k += n % 2;
		k *= e;
		n = Math.floor(n/2);
		e *= 10;
		print(">>" + k + " " + n + " " + e + "\n");
		++i;
	}
	k = k % Math.pow(10, t);
	print("##" + k + " " + n + " " + e + "\n");
	return k;
}
