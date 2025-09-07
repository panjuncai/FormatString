const fs = require('fs');
const path = require('path');

/**
 * 文本格式化脚本
 * 功能：将所有内容合并为一行
 */

function formatText(inputText) {
    // 简单粗暴：把所有非空行合并为一行
    const lines = inputText.split('\n');
    const nonEmptyLines = lines
        .map(line => line.trim())
        .filter(line => line !== '');
    
    return nonEmptyLines.join(' ');
}

function processFile(inputPath, outputPath = null) {
    try {
        // 读取输入文件
        const inputText = fs.readFileSync(inputPath, 'utf8');
        
        // 格式化文本
        const formattedText = formatText(inputText);
        
        // 确定输出文件路径
        if (!outputPath) {
            const ext = path.extname(inputPath);
            const name = path.basename(inputPath, ext);
            const dir = path.dirname(inputPath);
            outputPath = path.join(dir, `${name}_formatted${ext}`);
        }
        
        // 写入输出文件
        fs.writeFileSync(outputPath, formattedText, 'utf8');
        
        console.log(`✅ 文件处理完成！`);
        console.log(`📁 输入文件: ${inputPath}`);
        console.log(`📁 输出文件: ${outputPath}`);
        
        return outputPath;
    } catch (error) {
        console.error('❌ 处理文件时出错:', error.message);
        process.exit(1);
    }
}

// 命令行使用
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
📖 文本格式化工具

用法:
  node text-formatter.js <输入文件> [输出文件]

示例:
  node text-formatter.js novel.txt
  node text-formatter.js novel.txt formatted_novel.txt

功能:
  - 将所有内容合并为一行
  - 删除所有空行和换行符
  - 自动生成输出文件名（如果未指定）
        `);
        process.exit(0);
    }
    
    const inputFile = args[0];
    const outputFile = args[1] || null;
    
    // 检查输入文件是否存在
    if (!fs.existsSync(inputFile)) {
        console.error(`❌ 输入文件不存在: ${inputFile}`);
        process.exit(1);
    }
    
    processFile(inputFile, outputFile);
}

module.exports = { formatText, processFile };
