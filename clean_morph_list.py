input_file = "C:/Cmder/Projects/SnekLogger/src/constants/CleanedMorphTypes.js"
output_file = "C:/Cmder/Projects/SnekLogger/src/constants/2CleanedMorphTypes.js"

with open(input_file, "r") as infile, open(output_file, "w") as outfile:
    for line in infile:
        # Check if the line contains a morph name (you can adjust this condition as needed)
        if "Base morph" not in line and "Small round image" not in line:
            outfile.write(line)

print("Morph types cleaned and saved to", output_file)